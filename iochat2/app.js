const MongoDb = require('mongodb');
const MongoClient = MongoDb.MongoClient;

const express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const bodyParser = require('body-parser');
const path = require('path');

/////////////////////////////////////////////////////////////////////////////

var url = "mongodb://localhost:27017/";
var db;

MongoClient.connect(url, function(err, resultdb) {
    if (err) throw err;
    db = resultdb.db("iochat2");
});
/////////////////////////////////////////////////////////////////////////////

// Body Parser Middleware - acts in between the get request and get response
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Global Vars Middleware
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

/////////////////////////////////////////////////////////////////////////////

app.get('/', function(req, res){

    db.collection('messages').find().sort({_id:-1}).limit(20).toArray(function(err, docs) {
        if(err){
            console.log(err);
        }else{
            res.render('index', {
                title: 'Current Users',
                users: docs
            });
        }
    });
});

app.get('/clear/', function(req, res){

    db.collection("users").deleteMany({}, function(err, result) {
        if(err){
            console.log(err);
        }
        console.log("DELETED");
        res.redirect('/users/hello');
    });
});
