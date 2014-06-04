var db = require('../config.js').db;
db.bind('q');
//{_id,title,getUrl,syncTime,category}
//保存lady数据
exports.save = function (obj, callback) {
    db.q.insert(obj, function (err, result) {
        callback(err, null);
    });
};
