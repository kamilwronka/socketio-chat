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
    socket.on('user joined', function(nickname) {
        console.log(nickname + " joined chat");
        io.emit('user joined', nickname);
        socket.on('disconnect', function(){
            console.log(nickname +  ' disconnected');
            io.emit('disconnect', nickname);
        });
    });
    socket.on('user typing', function(nickname, state) {

       io.emit('user typing', nickname, state);
       state = 0;
    });
    socket.on('chat message', function(msg, date, nickname) {
        console.log(date + " " + nickname + " - " + msg);
        io.emit('chat message', msg, date, nickname);
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});