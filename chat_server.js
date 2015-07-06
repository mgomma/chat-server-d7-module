var http = require('http').createServer(handler)
        , io = require('socket.io').listen(http).set('log level', 1)
        , mysql = require('./includes/scripts/dbops')
        , push_notification = require('./includes/scripts/appHelpers');
        
io.set('heartbeat interval', 10000);
io.set('heartbeat timeout', 2000);

http.listen(8283);


var users = {};
var log = {};

function handler(req, res) {
    res.writeHead(200);
    res.end();
}

io.sockets.on('connection', function (socket) {
    if(Object.keys(users).length > 0){
        socket.nsp.to(socket.id).emit('online users', Object.keys(users));
    }
    
    socket.on('user message', function (msg, ack) {
        if (typeof users[msg['receiver']] == 'undefined') {
            notify(msg);
        }
        else{
        length = users[msg['receiver']].length;
        for (i = 0; i < length; i++) {
            
            socketid = users[msg['receiver']][i];
            socket.broadcast.to(socketid).emit('user message', msg);
            }
        }
        mysql.insertMessage(msg, ack);
    });

    socket.on('user', function (user) {
        user['socket.id'] = socket.id;
        socket.uid = user['uid'];
        
        if(typeof users[user['uid']] == 'undefined'){
           socket.broadcast.emit('user status', {'uid':socket.uid, 'status': true});
           users[user['uid']] = []; 
        }
        
        users[user['uid']].push(socket.id);
    });

    socket.on('disconnect', function (data) {
        if (typeof socket.uid == 'undefined'){
            return;
        }

       length = users[socket.uid].length;

       if(length == 1){
          delete users[socket.uid];
          socket.broadcast.emit('user status', {'uid':socket.uid, 'status': false});
       }
       else{
        for (i = 0; i < length; i++) {
            if(socket.id == users[socket.uid][i]){
                users[socket.uid].splice(i, 1);
            }
        }
    }
    });

});

var callback = function callback(x, y, type) {
    console.log(x);
    console.log(y);
}

function notify(msg){
    var push = { uids: msg['receiver'],
                        message: {
                            type: 'chat_message',
                            body: msg
                        }
                    }
    push_notification.sendPushNotification(push);
}
