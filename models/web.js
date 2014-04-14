var db = require('../config.js').db;
db.bind('web');

//保存网站设置
exports.save = function (obj, callback) {
    db.web.insert(obj, function (err, result) {
        callback(err, null);
    });
};
//根据ID获取网站设置
exports.getById = function (id, callback) {
    db.web.findOne({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}
//根据ID更新网站设置
exports.update = function (id, obj, callback) {
    db.web.update({ _id: db.ObjectID.createFromHexString(id) }, { $set: obj }, function (err, result) {
        callback(err, result);
    })
};
//根据标识更新网站设置对像
exports.updateByUnique = function (unique, obj, callback) {
    db.web.update({ unique: unique }, { $set: obj }, { upsert: true }, function (err, result) {
        callback(err, result);
    });
}
//根据标识获取网站设置对像
exports.getByUnique = function (unique, callback) {
    db.web.findOne({ unique: unique }, function (err, result) {
        callback(err, result);
    });
}
//获取一类网站设置对像
exports.getByQuery = function (query, callback) {
    db.web.find(query, options).toArray(callback);
}
