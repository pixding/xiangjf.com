var dimgMod = require('../models/dimg');
var webMod = require('../models/web');
var config = require('../config.js').config;
var postMod = require('../models/post');
var EventProxy = require('eventproxy').EventProxy;

//图片详情页
exports.pinsdetail = function (req, res, next) {
    var id = req.params.id;
    if (id.length != 24) {
        return next();
    }
    dimgMod.getById(id, function (err, imgmod) {
        if (err || !imgmod) {
            return next();
        }
        var kind = imgmod.kind;

        var proxy = new EventProxy();
        function render(taglist, imglist) {
            res.render(config.theme + 'imgdetail', { layout: false, imgmod: imgmod, taglist: taglist, imglist: imglist });
        }
        proxy.assign("gettaglist", "getimglist", render);

        dimgMod.getTags({ kind: kind }, function (err, result) {
            if (err) {
                return next();
            }
            proxy.trigger("gettaglist", result);
        });

        dimgMod.getByQuery({ kind: kind, _id: { $gt: imgmod._id } }, { limit: 12, sort: { _id: 1 } }, function (err, result) {
            proxy.trigger("getimglist", result);
        });

    });
}
//图片首页
exports.imgindex = function (req, res, next) {
    var proxy = new EventProxy();
    function render(alltaglist) {
        res.render(config.theme + 'imgindex', { layout: false, alltaglist: alltaglist });
    }

    proxy.after('get_tagcon', 5, function (alltaglist) {
        render(alltaglist);
    });
    for (var j = 1; j <= 5; j++) {
        dimgMod.getTagFirstOne(j.toString(), function (err, result) {
            
            proxy.emit('get_tagcon', result);
        });
    }
}

//图片列表页
exports.pins = function (req, res, next) {
    var pagesize = 100;
    var page = req.query.page || 1;
    var kind = req.params.kind;
    var query = {};
    var tagquery = {};
    if (kind) {
        query.kind = kind;
        tagquery.kind = kind;
    }
    var tag = req.query.tag || "";
    if (tag != "") {
        query.tag = tag;
    }
    dimgMod.count(query, function (err, count) {
        if (err) {
            next();
        }
        var pagemaxnum = pagesize;
        var totalpage = Math.ceil(count / pagesize) || 1;
        if (page >= totalpage) {
            page = totalpage;
            pagemaxnum = count - (page - 1) * pagesize;
        }

        var proxy = new EventProxy();
        function render(list, tags) {
            res.render(config.theme + 'imglist', { layout: false, maxnum: pagemaxnum, imglist: list, kind: kind, total: count, page: page, tag: tag, tags: tags });
        }
        proxy.assign("list", "tags", render);
        dimgMod.getByQuery(query, { skip: (page - 1) * pagesize, limit: 25, sort: { date: -1 } }, function (err, result) {
            if (err) {
                return next();
            }
            proxy.trigger("list", result);
        });

        dimgMod.getTags(tagquery, function (err, result) {
            if (err) {
                return next();
            }
            proxy.trigger("tags", result);
        });
    });



};
//图片瀑布加载
exports.pinsdata = function (req, res, next) {
    var kind = req.query.kind;
    var tag = req.query.tag;
    var pn = req.query.pn || 20;
    var rn = req.query.rn || 20;
    var query = {};
    if (kind) {
        query.kind = kind;
    }
    if (tag) {
        query.tag = tag;
    }
    dimgMod.getByQuery(query, { skip: pn, limit: rn, sort: { date: -1 } }, function (err, result) {
        if (err) {
            return next();
        }
        res.json({ list: result });
    });

}
