
var pimgMod = require('../models/pimg');
var dimgMod = require('../models/dimg');
var dateFormat = require('dateformat');
var lib = require('../common/lib.js');
var config = require('../config.js').config;

var path = require('path');
var request = require('request');
var fs = require('fs');
var EventProxy = require('eventproxy').EventProxy;
var uploadpath = path.join(path.dirname(__dirname), 'public');
var pimgpath = path.join(path.dirname(__dirname), 'public/pimg');
var http = require('http');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');


exports.getdImg = function (req, res, next) {
    if (req.method == "GET") {
        var kind = req.query.kind || "";
        var tag = req.query.tag || "";
        var page = req.query.page || 1;
        var limit = config.static.pagesize;
        var query = {};
        var tagquery = {};
        if (kind) {
            query.kind = parseInt(kind, 10) + "";
            tagquery.kind = parseInt(kind, 10) + "";
        }
        if (tag != "") {
            query.tag = tag;
        }
        dimgMod.count(query, function (err, count) {
            if (err) {
                next();
            }
            var totalpage = Math.ceil(count / limit) || 1;
            if (page > totalpage) {
                page = totalpage;
            }

            var proxy = new EventProxy();
            function render(list, tags) {
                res.render("admin/pimg/list", { layout: false, kind: kind, tag: tag, tags: tags, list: list, page: page, total: count });
            }
            proxy.assign("list", "tags", render);
            dimgMod.getByQuery(query, { skip: (page - 1) * limit, limit: limit, sort: { date: -1 } }, function (err, result) {
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
    }
}

exports.getImg = function (req, res, next) {
    if (req.method == "GET") {
        var kind = req.query.kind || "";
        var tag = req.query.tag || "";
        var page = req.query.page || 1;
        var limit = config.static.pagesize;
        var query = {};
        var tagquery = {};
        if (kind) {
            query.kind = parseInt(kind, 10)+"";
            tagquery.kind = parseInt(kind, 10)+"";
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
            
            var proxy = new EventProxy();
            function render(list, tags) {
                res.render("admin/pimg/pull", { layout: false, kind: kind, tag: tag, tags:tags, list: list, page: page, total: count });
            }
            proxy.assign("list", "tags", render);
            pimgMod.getByQuery(query, { skip: (page - 1) * limit, limit: limit, sort: { enable: 1,date:-1 } }, function (err, result) {
                if (err) {
                    return next();
                }
                proxy.trigger("list", result);
            });
            
            pimgMod.getTags(tagquery, function (err, result) {
                if (err) {
                    return next();
                }
                proxy.trigger("tags", result);
            });
        });
    }
    if (req.method == "POST") {
        var url = req.body.url;
        var tag = req.body.tag;
        var kind = req.body.kind;

        download(url, function (data) {
            console.log(data);
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
                pimgMod.updateByUnique({bdid:imgobj.bdid},imgobj, function (err, result) {
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
    
    var query = {};
    query.enable = null;

    pimgMod.getByQuery(query, {}, function (err, result) {
        if (err) {
            return next();
        }
        var d = dateFormat(new Date(), "yyyymmdd");
        var new_path = path.join(pimgpath, d);
        var exist = fs.existsSync(new_path)
        if (!exist) {
            fs.mkdirSync(new_path);
        }
        for (var i = 0; i < result.length; i++) {
            var pimg = {};
            pimg.desc = result[i].desc;
            pimg.w = result[i].w;
            pimg.h = result[i].h;
            pimg.tag = result[i].tag;
            pimg.date = result[i].date;
            pimg.kind = result[i].kind;
            pimg.imgurl = result[i].imgurl;

            var time = new Date().getTime();
            var ext = path.extname(pimg.imgurl);
            var new_name = result[i].bdid+time + ext;
            var _ipath = path.join(new_path,new_name);
            
            pimg.src = d + "/" + new_name;
            
            saveImg(pimg.imgurl, _ipath);
            dimgMod.save(pimg, function (err, _res) {});
            pimgMod.updateByUnique({ bdid: result[i].bdid }, { enable: 1 }, function (err, __res) { });

        }
        res.json({ res: 1 });
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

exports.singleDown = function (req, res, next) {
    
    var downurl = req.body.downurl;
    var savepath = req.body.savepath;
    saveImg(downurl, path.join(uploadpath, savepath));
    res.json({ res: 1 });
}

function saveImg(url, name) {
    console.log(url);
    var request = http.get(url, function (res) {
        var imagedata = ''
        res.setEncoding('binary')

        res.on('data', function (chunk) {
            imagedata += chunk
        })

        res.on('end', function () {
            console.log(imagedata);
            fs.writeFile(name, imagedata, 'binary', function (err) {
                if (err) {
                    console.log(url+"error");
                }
            })
        })

    })
}