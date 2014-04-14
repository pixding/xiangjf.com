
/*
 * GET home page.
 */

var webMod = require('../models/web');
var config = require('../config.js').config;
var postMod = require('../models/post');
var EventProxy = require('eventproxy').EventProxy;


exports.index = function (req, res, next) {

    webMod.getByUnique("ibanner", function (err, result) {
        if (err) {
            return next();
        }
        webMod.getByUnique("list1", function (err1, result1) {
            if (err1) {
                return next();
            }
            res.render(config.theme + 'index', { layout: false, banner: result ? result.obj : [], hotlist: result1?result1.obj:[] });
        });
        
    });
    
};
//详情页
exports.detail = function (req, res,next) {
    var idpage = req.params.id;
    var _list = idpage.split('_');
    var id = _list[0];
    var page = _list[1] || 1;
    postMod.getById(id, function (err, result) {
        if (err) {
            return next();
        }
        postMod.updateRead(id,function () {
        });
        res.render(config.theme + "detail", { layout: false, post: result, page: page });
    });
};
//点击热门文章
exports.hotList = function (req, res, next) {
    var category = parseInt(req.params.cate, 10);
    
    var proxy = new EventProxy();
    setHot = function (moreList, lessList) {
        res.locals.moreList = moreList;
        res.locals.lessList = lessList;
        next();
    }
    proxy.assign("moreList", "lessList", setHot);
    
    var moreQuery = {};
    moreQuery.enable = 1;
    if (category) {
        moreQuery.category = category;
    }
    postMod.getByQuery(moreQuery, { limit: 8, sort: { readCount: -1, id: -1 } }, function (err, result) {
        proxy.trigger("moreList", result);
    });
    postMod.getByQuery(moreQuery, { limit: 8, sort: { readCount: 1, id: -1 } }, function (err, result) {
        proxy.trigger("lessList", result);
    });
}

//分类列表
exports.categoryList = function (req, res, next) {
    var category = parseInt(req.params.cate, 10);
    if (!category) {
        return next();
    }

    var page = req.query.page || 1;
    page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    var limit = config.static.listsize;
    postMod.count({ category: category,enable:1}, function (err, count) {
        if (err) {
            return next();
        }
        var totalpage = Math.ceil(count / limit) || 1;
        if (page > totalpage) {
            page = totalpage;
        }
        postMod.getByQuery({ category: category, enable: 1 }, { skip: (page - 1) * limit, limit: limit, sort: { createDate: -1, _id: -1 } }, function (err, result) {
            if (err) {
                return next();
            }
            res.render(config.theme+"list", { layout: false,key:"", category:category, list: result, page: page, total: count });
        });
    });
}


//搜索列表
exports.searchList = function (req, res, next) {
    var key = req.query.key;
    if (key == "") {
        key = "瘦身";
    }
    if (key) {
        res.redirect("/key_" + key);
        return false;
    }

    var key = req.params.key;
    key = key;

    var page = req.query.page || 1;
    page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    var limit = config.static.listsize;
    var query = {};
    if (key) {
        
        var keyReg = new RegExp(key);
        query = { "$or": [{ desc: keyReg }, { title: keyReg }] };
    }
    postMod.count(query, function (err, count) {
        if (err) {
            return next();
        }
        var totalpage = Math.ceil(count / limit) || 1;
        if (page > totalpage) {
            page = totalpage;
        }
        postMod.getByQuery(query, { skip: (page - 1) * limit, limit: limit, sort: { createDate: -1, _id: -1 } }, function (err, result) {
            if (err) {
                return next();
            }
            res.render(config.theme + "search", { layout: false, key: key,category:0, list: result, page: page, total: count });
        });
    });
}