const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const MongoDb = require('mongodb');
const MongoClient = MongoDb.MongoClient;

/////////////////////////////////////////////////////////////////////////////

var url = "mongodb://localhost:27017/";
var db;

var app = express();

MongoClient.connect(url, function(err, resultdb) {
    if (err) throw err;
    db = resultdb.db("myapp1");
});

// View Engine sets the data type and the folder where the page files are located
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length){
            formParam += '['+ namespace.shift() +']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

/////////////////////////////////////////////////////////////////////////////

app.get('/', function(req, res){
    //res.json(people); // can send items in json format this way
    //res.send('Hello');

    db.collection('users').find({}).toArray(function(err, docs) {
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

app.get('/eric/', function(req, res){
    //res.json(people); // can send items in json format this way
    //res.send('Hello');

    console.log("erics");

    db.collection('users').find({ last_name : {$lt : 'c'} }).toArray(function(err, docs) {
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

app.post('/users/add', function(req, res){
    
    req.checkBody('firstname', 'First Name is required').notEmpty();
    req.checkBody('lastname', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        db.collection('users').find({}).toArray(function(err, docs) {
            if(err){
                console.log(err);
            }else{
                res.render('index', {
                    title: 'Current Users',
                    users: docs,
                    errors: errors
                });
            }
        });
        console.log('ERRORS');
    }else{
        var newUser = {
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            email: req.body.email
        }
        db.collection('users').insertOne(newUser, function(err, res) {
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
        console.log('SUBMITTED');
    }
});

app.delete('/users/delete/:id', function(req, res){
    //console.log(req.params.id);
    var myquery = {
        _id : new MongoDb.ObjectId(req.params.id)
    };
    db.collection("users").deleteOne(myquery, function(err, result) {
        if(err){
            console.log(err);
        }
        console.log("DELETED");
        //res.redirect('/users/hello');
    });
});

app.listen(3000, function(){
    console.log('Server started on port 3000');
});