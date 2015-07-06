var request = require('request');

var config = require('../config/app-config');



var getTimestamp = function() {
    return new Date().getTime();
};


var sendPushNotification = function(payload) {

    var PUSH_NOTIFICATION__SERVER_URL = config.constants.pushServerUrl;

    var headers = {
        'Content-Type': 'application/json'
    };

    request.post({
        url: PUSH_NOTIFICATION__SERVER_URL,
        headers: headers,
        form: payload
    }, function(err, response, body) {

        if(err) {
            console.log(err);
        }

        console.log(JSON.stringify(body));
    });
};


exports.getTimestamp = getTimestamp;
exports.sendPushNotification = sendPushNotification;

