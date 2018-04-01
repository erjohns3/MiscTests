const express = require('express');
const router = express.Router();
const model = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');  // sets the name of the class thats used to call all the functions from

// Register
router.post('/register', function (req, res, next) {
    let newUser = new User({  // name of the class is whatever the require const is at the top
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, function (err, user) {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to register user'
            });
        } else {
            res.json({
                success: true,
                msg: 'User registered'
            });
        }
    });
    //res.send('REGISTER');
});

// Authenticate
router.post('/authenticate', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'Username not found' });
        }
        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) throw err
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, { expiresIn: 604800 });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            } else {
                return res.json({
                    success: false,
                    msg: 'Password incorrect'
                });
            }

        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    res.json({user: req.user});
});

// Validate
router.get('/validate', function (req, res, next) {
    res.send('VALIDATE');
});

module.exports = router;