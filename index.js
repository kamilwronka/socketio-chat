var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/src'));

io.on('connection', function(socket){
    socket.on('user joined', function(nickname) {
        console.log(nickname + " joined chat");
        io.emit('user joined', nickname);
        users.push(nickname);
        io.emit('active users', users.length, users);
        socket.on('disconnect', function(){
            console.log(nickname +  ' disconnected');
            var index = users.indexOf(nickname);
            if(index > -1) {
                users.splice(index, 1);
            }
            io.emit('active users update', users.length, users);
            io.emit('disconnect', nickname);
        });
    });
    socket.on('user is typing', function(nickname, typing) {

       io.emit('user typing', nickname, typing);
    });
    socket.on('chat message', function(msg, date, nickname) {
        console.log(date + " " + nickname + " - " + msg);
        socket.broadcast.emit('chat message', msg, date, nickname);
        socket.emit('chat message sender', msg, date, nickname);
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});