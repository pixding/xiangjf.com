﻿var db = require('../config.js').db;
db.bind('pimg');
/*
desc
imgurl
w
h
bdid:
colum: 大分类 明星 搞笑 美女 摄影 服饰 动漫 壁纸 旅游 汽车 设计 家居 
date
*/
//保存图片
exports.save = function (obj, callback) {
    db.pimg.insert(obj, function (err, result) {
        callback(err, null);
    });
};
//根据ID获取图片
exports.getById = function (id, callback) {
    db.pimg.findOne({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}

//根据ID移除图片
exports.removeById = function (id, callback) {
    db.pimg.remove({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}
//根据条件移除图片
exports.remove = function (query, callback) {
    db.pimg.remove(query, function (err, result) {
        callback(err, result);
    });
}
//根据条件获取图片列表
exports.getByQuery = function (query, options, callback) {
    db.pimg.find(query, options).toArray(callback);
};

//获取总数量
exports.count = function (query, callback) {
    db.pimg.count(query, function (err, count) {
        callback(err, count);
    });
};

//根据标识更新网站设置对像
exports.updateByUnique = function (query, obj, callback) {
    db.pimg.update(query, { $set: obj }, { upsert: true }, function (err, result) {
        callback(err, result);
    });
}

//得到分类下面的标签
exports.getTags = function (query, callback) {
    db.pimg.distinct("tag", query, function (err, result) {
        callback(err, result);
    });
}