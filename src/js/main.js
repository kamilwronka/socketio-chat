(function() {
    'use strict';
    var socket = io();
    var chatSubmit, chatAppend, sendMsgBtn, message, messages, appendInfo;

    message = document.querySelector('.message-input');
    messages = document.querySelector('.messages');

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
        socket.emit('chat message', message.value, date);
    };
    chatAppend = function(msg, date) {
        var elem = document.createElement('div');
        elem.classList.add('message');
        elem.innerHTML = date + " - " + msg;
        messages.appendChild(elem);
        message.value = "";
    };
    appendInfo = function(info) {
        var elem = document.createElement('div');
        elem.classList.add('info');
        elem.innerHTML = info;
        messages.appendChild(elem);
    }
    socket.on('chat message', function(msg, date){
        chatAppend(msg, date);
    });
    socket.on('user connected'), function(info) {
        appendInfo(info);
    };
    sendMsgBtn = document.querySelector('.send-message-btn');
    sendMsgBtn.addEventListener('click', chatSubmit);

    document.body.addEventListener('keydown', function(ev) {
        console.log(ev.keyCode);
        if(message !== document.activeElement && ev.keyCode === 13) {
            message.focus();
        } else if(message === document.activeElement && ev.keyCode === 13) {
            chatSubmit();
        }
    })
})();