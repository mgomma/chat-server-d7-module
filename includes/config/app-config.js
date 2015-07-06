var env = process.env.NODE_ENV || 'development';


var dbConfig = {
    development: {
        host: 'localhost',
        database: 'cjournalist',
        user: 'root',
        password: 'root',
        port: 3306
    },
    production: {
        host: 'localhost',
        database: 'cjournalist',
        user: 'root',
        password: 'root',
        port: 3306
    }
};


var appConstants = {
    development: {
        env: env,
        port: 3322,
        pm2AppName: 'chatserver-Live',
        pushServerUrl: 'http://pushserver3.ddasolutions.net/alshari3-journalist/push/stuff-notifier'
    },
    production: {
        env: env,
        port: 3323,
        pm2AppName: 'chatserver-live',
        pushServerUrl: 'http://pushserver3.ddasolutions.net/alshari3-journalist/push/stuff-notifier'
    }
};


exports.db = dbConfig[env];
exports.constants = appConstants[env];
exports.devMode = (env === 'production') ? false : true;

