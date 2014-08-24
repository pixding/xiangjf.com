var db = require('../../config.js').db;

db.u_user = db.bind('u_user');

exports.insert = function (user, callback) {
    db.u_user.insert(user, function (err, result) {
        callback(err, result);
    });
};

exports.findOne = function (query, callback) {
    db.u_user.findOne(query, function (err, result) {
        callback(err, result);
    });
};
