var db = require('../config.js').db;
db.bind('dimg');
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
    db.dimg.insert(obj, function (err, result) {
        callback(err, null);
    });
};
//根据ID获取图片
exports.getById = function (id, callback) {
    db.dimg.findOne({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}

//根据ID移除图片
exports.removeById = function (id, callback) {
    db.dimg.remove({ _id: db.ObjectID.createFromHexString(id) }, function (err, result) {
        callback(err, result);
    });
}
//根据条件获取图片列表
exports.getByQuery = function (query, options, callback) {
    db.dimg.find(query, options).toArray(callback);
};

//获取总数量
exports.count = function (query, callback) {
    db.dimg.count(query, function (err, count) {
        callback(err, count);
    });
};
//根据标识更新网站设置对像
exports.updateByUnique = function (query, obj, callback) {
    db.dimg.update(query, { $set: obj }, { upsert: true }, function (err, result) {
        callback(err, result);
    });
}
//用ID更新文章
exports.update = function (id, obj, callback) {
    db.dimg.update({ _id: db.ObjectID.createFromHexString(id) }, { $set: obj }, function (err, result) {
        callback(err, result);
    })
};
//得到分类下面的标签
exports.getTags = function (query, callback) {
    db.dimg.distinct("tag", query, function (err, result) {
        callback(err, result);
    });
}

exports.getTagFirstOne = function (kind,callback) {
    db.dimg.group(["tag"], { kind: kind }, { "src": 0, "w": 0, "h": 0, "desc": "", "date": "2013-01-01" }, function (obj, prev) {
        if (prev.date < obj.date) {
            prev.src = obj.src;
            prev.w = obj.w;
            prev.h = obj.h;
            prev.desc = obj.desc;
            prev.date = obj.date;
        }
    }, function (err, result) {
        callback(err, result);
    });
}