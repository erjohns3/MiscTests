const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');

mongoose.connect(config.database);
var db = mongoose.connection;

// On connection
db.on('connected', function(){
    console.log('Connected to database '+config.database);
});
//On disconnect
db.on('error', function(err){
    console.log('database error: '+err);
});

const app = express();

const users = require('./routes/users');

const port = 3000;

// Set static folder
app.use(express.static(path.join(__dirname, 'client')));

// CORS middleware
app.use(cors());

// body parser middleware
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// the module.exports function in ./config/passport.js
require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', function(req, res){
    res.send('HOME');
});

// Start Server
app.listen(port, function(){
    console.log('Server started in port '+port);
});