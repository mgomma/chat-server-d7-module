var mysql = require('mysql');
var _ = require('lodash');

var noop = _.noop();
var appConfig = require('../config/app-config');


var dbConnect = function(cb) {

    var callback = cb || noop;

    var connection = mysql.createConnection(appConfig.db);
    connection.connect(function(err) {
        if(err) {
            return callback(err, null);
        }
        return callback(null, connection);
    });
}



var insertMessage = function(message, cb) {
//console.log(message);
    var callback = cb || noop;

    dbConnect(function(err, connection) {

        if(err) {
            return callback(err, null);
            console.log('error');
        }
        if(connection) {
            query = 'INSERT INTO chat_messages SET sender = ' + connection.escape(message['sender'])
            +', receiver = ' + connection.escape(message['receiver'])
            +', message = ' + connection.escape(message['message'])
            +', timestamp = ' + connection.escape(message['timestamp']);
            //console.log(query);
//            connection.query('INSERT INTO chat_messages SET ?', message, function(err2, result) {
            connection.query(query, null, function(err2, result) {
                res = typeof result.insertId == 'number' && result.insertId > 0 ? 1 : 0;
                return callback(res);
            });
        }
    });
}



var getMessages = function(search, cb) {

    var callback = cb || noop;

    dbConnect(function(err, connection) {

        if(!search) search = {};

        if(err) {
            return callback(err, null);
        }


        if(connection) {
            var limit = search.limit || 30;
            //var page = search.page || 1;
            var sender_uid = search.sender_uid || null;
            var receiver_uid = search.receiver_uid || null;
            var timestamp = search.timestamp || 9999999 * 9999999999;
            //var offset = (page - 1) * limit;

            var injects = [
                sender_uid, receiver_uid, receiver_uid, sender_uid, timestamp, limit
            ];

            var query = "SELECT * FROM chat_message WHERE (( `sender_uid` = ? AND `receiver_uid` = ? )  OR  ( `sender_uid` = ? AND `receiver_uid` = ? )) AND timestamp < ?  ORDER BY `timestamp` DESC  LIMIT ? ;";
            query = mysql.format(query, injects);

            connection.query(query, function(err2, rows) {

                if(err2) {
                    return callback(err2, null);
                }

                rows = rows.reverse();
                callback(null, rows);
            });
        }
    });
}



exports.insertMessage = insertMessage;
exports.getMessages = getMessages;
