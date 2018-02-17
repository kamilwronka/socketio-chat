(function() {
    'use strict';
    var socket = io();
    var chatSubmit, chatAppend, sendMsgBtn, message, messages, appendInfo, appendTyping;
    var nickname = prompt("Podaj swoj nick:");
    message = document.querySelector('.message-input');
    messages = document.querySelector('.messages');

    socket.emit('user joined', nickname);

    chatSubmit = function() {
        var getDate = new Date(),
            minutes,
            hours,
            date;
        hours = getDate.getHours();
        minutes = getDate.getMinutes();
        if(hours < 10) {hours = "0" + hours;}
        if(minutes < 10) {minutes = "0" + minutes;}
        date = hours + ':' + minutes;
        socket.emit('chat message', message.value, date, nickname);
    };
    chatAppend = function(msg, date, nickname) {
        var elem = document.createElement('div');
        var messageInfo = document.createElement('div');
        elem.classList.add('message');
        elem.innerHTML = msg;
        messageInfo.classList.add('message-info');
        messageInfo.innerHTML = nickname + " - " + date;
        elem.addEventListener('click', function(){
            messageInfo.classList.toggle('message-info-opened');
        });
        messages.appendChild(messageInfo);
        messages.appendChild(elem);
        elem.scrollIntoView({behavior: "smooth", block: "end", inline: "end"});
        message.value = "";
    };
    appendTyping = function(nickname) {
        var elem = document.createElement('div');
        elem.classList.add('message');
        elem.innerHTML = nickname + " is typing...";
        messages.appendChild(elem);
    };
    appendInfo = function(info) {
        var elem = document.createElement('div');
        elem.classList.add('info');
        elem.innerHTML = info;
        messages.appendChild(elem);
        elem.scrollIntoView({behavior: "smooth", block: "end", inline: "end"});
    };
    socket.on('chat message', function(msg, date, nickname){
        chatAppend(msg, date, nickname);
    });
    socket.on('user joined', function(nickname) {
        appendInfo(nickname + " joined chat");
    });
    socket.on('user typing', function(nickname, state) {
        if(state === 1) {
            appendTyping(nickname);
        } else if(state === 0) {

        }
    });
    socket.on('disconnect', function(nickname) {
        appendInfo(nickname + " disconnected");
    });

    sendMsgBtn = document.querySelector('.send-message-btn');
    sendMsgBtn.addEventListener('click', chatSubmit);

    document.body.addEventListener('keydown', function(ev) {
        console.log(ev.keyCode);
        if(message !== document.activeElement && ev.keyCode === 13) {
            message.focus();
        } else if(message === document.activeElement && ev.keyCode === 13) {
            chatSubmit();
        }
        if(message.value.length > 0) {
           var state = 1;
          socket.emit('user typing', nickname, state);
           console.log(message.value);
       }
    })
})();