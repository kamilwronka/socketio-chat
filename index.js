var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/src'));

io.on('connection', function(socket){
    console.log('a user connected');
    info = "User connected";
    io.emit('user connected', info);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg, date) {
        console.log(msg + date);
        io.emit('chat message', msg, date);
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});