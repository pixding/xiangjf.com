
var webMod = require('../models/web');
var dateFormat = require('dateformat');
var lib = require('../common/lib.js');
var config = require('../config.js').config;

var path = require('path');
var request = require('request');
var fs = require('fs');
var EventProxy = require('eventproxy').EventProxy;
var upload_path = path.join(path.dirname(__dirname), 'public');
//首页设置
exports.banner = function (req, res, next) {
    webMod.getByUnique("ibanner", function (err, result) {
        if (err) {
            return next();
        }
        if (result&&result.obj) {
            res.render("admin/web/banner", { layout: false, banner: result.obj });
        } else {
            res.render("admin/web/banner", { layout: false,banner:null });
        }
    });
}

exports.postBanner = function (req, res, next) {
    var titleList = req.body.title;
    var urlList = req.body.url;
    var sortList = req.body.sort;
    var imgurlList = req.body.imgurl;
    var bannerList = [];
    for (var i = 0; i < titleList.length; i++) {
        var banner = {};
        banner.title = titleList[i];
        banner.url = urlList[i];
        banner.imgurl = imgurlList[i];
        banner.sort = sortList[i];
        bannerList.push(banner);
    }
    bannerList.sort(function(a,b) {
        return a.sort - b.sort;
    });
    webMod.updateByUnique("ibanner", { obj: bannerList }, function (err, rlt) {
        if (err) {
            res.json({ res: -1, msg: err });
        }
        res.json({ res: 1 });
    });
    

}

//热门文单
exports.hpost = function (req, res, next) {
    if (req.method == "GET") {
        webMod.getByUnique("list1", function (err, result) {
            if (err) {
                return next();
            }
            if (result && result.obj) {
                res.render("admin/web/hpost", { layout: false, postList: result.obj });
            } else {
                res.render("admin/web/hpost", { layout: false, postList: [] });
            }
        });
        
    }
    if (req.method == "POST") {
        var name = req.body.postlist;

        var pid = req.body.pid;
        var ptitle = req.body.ptitle;
        var pcategory = req.body.pcategory;
        var pdesc = req.body.pdesc;
        var postList = [];
        for (var i = 0; i < pid.length; i++) {
            var obj = {};
            obj.pid = pid[i];
            obj.ptitle = ptitle[i];
            obj.pcategory = pcategory[i];
            obj.pdesc = pdesc[i];
            postList.push(obj);
        }
        webMod.updateByUnique(name.toString(), { obj: postList }, function (err, rlt) {
            if (err) {
                res.json({ res: -1, msg: err });
            }
            res.json({ res: 1 });
        });
    }
}


