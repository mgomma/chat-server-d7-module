var env = process.env.NODE_ENV || 'development';


var dbConfig = {
    development: {
        host: 'localhost',
        database: 'default',
        user: 'root',
        password: 'root',
        port: 3306
    },
    production: {
        host: 'localhost',
        database: 'default',
        user: 'root',
        password: 'root',
        port: 3306
    }
};

exports.db = dbConfig[env];
exports.constants = appConstants[env];
exports.devMode = (env === 'production') ? false : true;

