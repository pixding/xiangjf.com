var db = require('../config.js').db;
db.bind('post');

//保存文章
exports.save = function (obj, callback) {
    db.post.insert(obj, function (err, result) {
        callback(err, null);
    });
};
//根据ID获取文章
exports.getById = function (id, callback) {
    db.post.findOne({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}
//根据唯一标识获取文章
exports.getByUnique = function (unique, callback) {
    db.post.findOne({ unique: unique }, function (err, result) {
        callback(err, result);
    });
}
//根据ID移除文章
exports.removeById = function (id, callback) {
    db.post.remove({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}
//根据条件获取文章列表
exports.getByQuery = function (query, options, callback) {
    db.post.find(query, options).toArray(callback);
};
//用ID更新文章
exports.update = function (id, category, callback) {
    db.post.update({ _id: db.ObjectID.createFromHexString(id) }, { $set: category }, function (err, result) {
        callback(err, result);
    })
};
//用ID更新文章阅读量
exports.updateRead = function (id, callback) {
    db.post.update({ _id: db.ObjectID.createFromHexString(id) }, { $inc: { "readCount": 1 } }, function (err, result) {
        callback(err, result);
    })
};
//获取总数量
exports.count = function (query, callback) {
    db.post.count(query, function (err, count) {
        callback(err, count);
    });
};