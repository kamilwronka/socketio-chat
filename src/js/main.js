(function() {
    'use strict';
    var socket = io();
    var chatSubmit, chatAppend, sendMsgBtn, message, messages, appendInfo, appendTyping, addUserWindow, logInBtn;
    var nickname;
    message = document.querySelector('.message-input');
    messages = document.querySelector('.messages');



    addUserWindow = function() {
       var modal = document.createElement('div');
       var p = document.createElement('p');
       var input = document.createElement('input');
       var btn = document.createElement('button');
       btn.classList.add('log-in');
       input.classList.add('log-in-input');

       p.innerHTML = "Podaj swój nick:";

       modal.classList.add('modal');
       modal.appendChild(p);
       modal.appendChild(input);
       modal.appendChild(btn);
       document.body.appendChild(modal);
    };

    addUserWindow();

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
        message.value = "";
    };
    appendTyping = function(nickname) {
        var elem = document.createElement('div');
        var div = document.createElement('div');
        div.classList.add('wave');
        var span = [];

        for(var i = 0; i < 3; i++) {
            span[i] = document.createElement('span');
            span[i].innerHTML = ".";
            span[i].classList.add('dot');
            div.appendChild(span[i]);
        }
        elem.classList.add('message');
        elem.innerHTML = nickname + " is typing";
        elem.appendChild(div);
        messages.appendChild(elem);
    };
    appendInfo = function(info) {
        var elem = document.createElement('div');
        elem.classList.add('info');
        elem.innerHTML = info;
        messages.appendChild(elem);
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
            state = 0;
        } else if(state === 0) {

        }
    });
    socket.on('disconnect', function(nickname) {
        appendInfo(nickname + " disconnected");
    });

    logInBtn = document.querySelector('log-in');
    logInBtn.addEventListener('click', function() {
        var logInInput = document.querySelector('log-in-input');
        nickname = logInInput.value;
        socket.emit('user joined', nickname);
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
       if(message.value.length > 0 && message.value.length < 2) {
           var state = 1;
           socket.emit('user typing', nickname, state);
            console.log(message.value);
        }
    })
})();