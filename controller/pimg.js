
var pimgMod = require('../models/pimg');
var dateFormat = require('dateformat');
var lib = require('../common/lib.js');
var config = require('../config.js').config;

var path = require('path');
var request = require('request');
var fs = require('fs');
var EventProxy = require('eventproxy').EventProxy;
var upload_path = path.join(path.dirname(__dirname), 'public');
var http = require('http');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');

exports.getImg = function (req, res, next) {
    if (req.method == "GET") {
        var kind = req.query.kind || "";
        var tag = req.query.tag || "";
        var page = req.query.page || 1;
        var limit = config.static.pagesize;
        var query = {};
        if (kind) {
            query.kind = parseInt(kind, 10)+"";
        }
        if (tag!="") {
            query.tag = tag;
        }
        pimgMod.count(query, function (err, count) {
            if (err) {
                next();
            }
            var totalpage = Math.ceil(count / limit) || 1;
            if (page > totalpage) {
                page = totalpage;
            }
            pimgMod.getByQuery(query, { skip: (page - 1) * limit, limit: limit, sort: { enable: 1 } }, function (err, result) {
                if (err) {
                    return next();
                }
                res.render("admin/pimg/pull", { layout: false, kind: kind, tag: tag,list:result, page: page, total: count });
            });
        });
    }
    if (req.method == "POST") {
        var url = req.body.url;
        var tag = req.body.tag;
        var kind = req.body.kind;

        download(url, function (data) {
            var myjson = JSON.parse(data);
            var imglist = myjson.imgs;
            for (var i = 0; i < imglist.length - 1; i++) {
                
                var imgobj = {};
                imgobj.desc = imglist[i].desc;
                imgobj.imgurl = imglist[i].downloadUrl;
                imgobj.w = imglist[i].imageWidth;
                imgobj.h = imglist[i].imageHeight;
                imgobj.bdid = imglist[i].id;
                imgobj.bdtags = imglist[i].tags;
                imgobj.kind = kind;
                imgobj.tag = tag;
                imgobj.date = imglist[i].date;
                pimgMod.save(imgobj, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(imgobj.bdid + "save");
                    }
                });
            }
        })
        res.json({ res: 1 });
    }
}
exports.downloadimg = function (req, res, next) {
    
    pimgMod.getByQuery(query, { skip: (page - 1) * limit, limit: limit, sort: { enable: 1 } }, function (err, result) {
        if (err) {
            return next();
        }
        res.render("admin/pimg/pull", { layout: false, kind: kind, tag: tag, list: result, page: page, total: count });
    });
}

function download(url, callback, isgbk) {
    http.get(url, function (res) {
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on("end", function () {
            var str = "";
            if (isgbk) {
                var str = iconv.decode(bufferHelper.toBuffer(), 'GBK');
            } else {
                str = bufferHelper.toBuffer();
            }
            callback(str);
        });
    }).on("error", function () {

        callback(null);
    });
}
function saveImg(url, name) {

    var request = http.get(url, function (res) {
        var imagedata = ''
        res.setEncoding('binary')

        res.on('data', function (chunk) {
            imagedata += chunk
        })

        res.on('end', function () {
            fs.writeFile(name, imagedata, 'binary', function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('File saved.')
            })
        })

    })
}