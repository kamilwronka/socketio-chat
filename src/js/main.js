(function() {
    'use strict';
    var socket = io();
    var chatSubmit, chatAppend, sendMsgBtn, message, messages, appendInfo, appendTyping, logInBtn, logInFunc, disappearAnim, updateTyping, ifEmpty;
    var nickname;
    message = document.querySelector('.message-input');
    messages = document.querySelector('.messages');
    var logInInput = document.querySelector('.log-in-input');
    sendMsgBtn = document.querySelector('.send-message-btn');
    var modal = document.querySelector('.modal');


    var logged = false;
    var typing = false;

    //menu

    var menuToggle, showActiveUsers, activeUsersBtn, pageHeader, hideActiveUsers, settCloseBtn, menuToggleBtn;

    pageHeader = document.querySelector('.page-header');
    settCloseBtn = document.querySelector('.settings-hamburger');
    activeUsersBtn = document.querySelector('#active-users');
    menuToggleBtn = document.querySelector('.hamburger');

    menuToggle = function() {
        pageHeader.classList.toggle('nav-opened');
    };
    showActiveUsers = function() {
        pageHeader.classList.add('settings-opened');
    };
    hideActiveUsers = function() {
        pageHeader.classList.remove('settings-opened');
    };

    menuToggleBtn.addEventListener('click', menuToggle);
    activeUsersBtn.addEventListener('click', showActiveUsers);
    settCloseBtn.addEventListener('click', hideActiveUsers);


    //animations

    disappearAnim = function(elem) {
        var opacity = 1;
        console.log(elem);
        var frame = function() {
            opacity = opacity - 0.01;
            elem.style.opacity = opacity;
            if(opacity <= 0) {
                clearInterval(id);
                elem.remove();
            }
        };
        var id = setInterval(frame, 5);
    };

    //typing events

    updateTyping = function() {
        var inputValue = document.querySelector('.message-input').value;
        if(inputValue > 0) {
            typing = true;
        } else {
            typing = false;
        }
        socket.emit('user is typing', nickname, typing);
    };

    ifEmpty = function(elem) {
        if(elem.value === "") {
            return false;
        } else {
            return true;
        }
    };

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
        typing = false;
        updateTyping();
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

    //socket functions

    socket.on('chat message', function(msg, date, nickname){
        chatAppend(msg, date, nickname);
    });
    socket.on('user joined', function(nickname) {
        appendInfo(nickname + " joined chat");
    });
    socket.on('active users', function(amount, users) {
        var activeUsersAmnt = document.querySelector('.active-users-amnt'),
            activeUsersList = document.querySelector('.users-list');
        activeUsersAmnt.innerHTML = "(" + amount + ")";

        for(var i = 0; i < users.length; i++) {
            var user = document.createElement('li');
            user.innerHTML = users[i];
            activeUsersList.appendChild(user);
        }

        console.log(users);

    });
    socket.on('active users update', function(amount, users, nickname){
        var activeUsersAmnt = document.querySelector('.active-users-amnt'),
            activeUsersList = document.querySelector('.users-list'),
            activeUsers = document.querySelectorAll('li');

        activeUsersAmnt.innerHTML = "(" + amount + ")";

            for(var i = 0; i < amount; i++) {
                if(nickname === activeUsers[i].innerHTML) {
                    activeUsers[i].remove();
                    activeUsersList.removeChild(activeUsers[i]);
                    console.log(this);
                    console.log(activeUsers[i]);

                }
            }

    });
    socket.on('user is typing', function(nickname) {
        if(typing) {
            appendTyping(nickname);
        }
    });
    socket.on('disconnect', function(nickname) {
        appendInfo(nickname + " disconnected");
    });

    logInFunc = function() {
        disappearAnim(modal);
        nickname = logInInput.value;
        logged = true;
        socket.emit('user joined', nickname);
    };

    //btn events

    logInBtn = document.querySelector('.log-in');
    console.log(logInBtn);
    logInBtn.addEventListener('click', function() {
        if(ifEmpty(logInInput)) {
            logInFunc();
        } else {
            alert("empty nickname");
        }
    });


    sendMsgBtn.addEventListener('click', function() {
        if(ifEmpty(message)) {
            chatSubmit();
        } else {
            alert("empty message");
        }
    });
//keyboard events

    document.body.addEventListener('keydown', function(ev) {
        console.log(ev.keyCode);
        if(logged) {
            if(message !== document.activeElement && ev.keyCode === 13) {
                message.focus();
            } else if(message === document.activeElement && ev.keyCode === 13) {
                if(ifEmpty(message)) {
                    chatSubmit();
                } else {
                    alert("empty message");
                }
            }
        } else {
            if(logInInput !== document.activeElement && ev.keyCode === 13) {
                logInInput.focus();
            } else if(logInInput === document.activeElement && ev.keyCode === 13 ) {
                if(ifEmpty(logInInput)) {
                    logInFunc();
                }
            }
        }
        updateTyping();
    })



    //trianglify



    var pattern, bg;

    pattern = Trianglify({
        width: window.innerWidth,
        height: window.innerHeight,
        cell_size: 100,
        x_colors: [ '#CCCCCC', '#8B2635', '#373E40', '#FFFFFF']
    });
    bg = pattern.canvas();
    console.log(bg);
    var img = bg.toDataURL("image/png");
    modal.style.backgroundImage = "url(" + img + ")";
    modal.style.backgroundSize = "cover";
    modal.style.backgroundImage = "no-repeat";
    modal.style.backgroundAttachment = "fixed";

})();