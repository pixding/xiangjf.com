var db = require('../config.js').db;
db.bind('lady');
//{_id,title,getUrl,syncTime,category}
//保存lady数据
exports.save = function (obj, callback) {
    db.lady.insert(obj, function (err, result) {
        callback(err, null);
    });
};
//根据ID获取lady
exports.getById = function (id, callback) {
    db.lady.findOne({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}

//根据ID移除lady
exports.removeById = function (id, callback) {
    db.lady.remove({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}
//根据条件获取lady
exports.getByQuery = function (query, options, callback) {
    db.lady.find(query, options).toArray(callback);
};
//根据标识更新网站设置对像
exports.updateByUnique = function (getUrl, obj, callback) {
    db.lady.update({ getUrl: getUrl }, { $set: obj }, { upsert: true }, function (err, result) {
        callback(err, result);
    });
}
//获取总数量
exports.count = function (query, callback) {
    db.lady.count(query, function (err, count) {
        callback(err, count);
    });
};

