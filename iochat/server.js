const express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

var connections = [];
var users = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    //console.log(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // Disconnect
    socket.on('disconnect', function (data) {
        if (socket.username) {
            console.log(socket.username + ' disconnected');
            users.splice(users.indexOf(socket.username), 1);
        }

        connections.splice(connections.indexOf(socket), 1);
        updateUsernames()
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send message', function (data) {
        console.log(data);
        io.sockets.emit('new message', { 
            msg: data,
            user: socket.username
        });
    });

    socket.on('new user', function (data, callback) {
        socket.username = data;
        users.push(socket.username);
        callback(true);
        updateUsernames();
        console.log('Username: ' + data);

    });
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

});

