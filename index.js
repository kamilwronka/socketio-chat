var express = require('express')
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
<<<<<<< HEAD
        socket.on('disconnect', function(){
            console.log(nickname +  ' disconnected');
            io.emit('disconnect', nickname);
        });
    });
    socket.on('user typing', function(nickname) {

       io.emit('user typing', nickname);
    });
=======
        users.push(nickname);
        io.emit('active users', users.length, users);
        console.log(users + "," + users.length);
        socket.on('disconnect', function(){
            console.log(nickname +  ' disconnected');
            var index = users.indexOf(nickname);
            if(index > -1) {
                users.splice(index, 1);
            }
            io.emit('active users update', users.length, users, nickname);
            io.emit('disconnect', nickname);
        });
    });
    socket.on('user is typing', function(nickname, typing) {

       io.emit('user typing', nickname, typing);
    });
>>>>>>> 5537612271980240e8692e8e1fe0ca3904b0e1fb
    socket.on('chat message', function(msg, date, nickname) {
        console.log(date + " " + nickname + " - " + msg);
        io.emit('chat message', msg, date, nickname);
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});