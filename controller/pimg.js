﻿
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
var im = require('imagemagick');




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
        //var url = req.body.url;
        var tag = req.body.tag;
        var kind = req.body.kind;
        var geturl = ["", "http://image.baidu.com/channel/listjson?pn=0&rn=300&tag1=明星&sorttype=0&fr=channel&tag2=",
            "http://image.baidu.com/channel/listjson?fr=channel&tag1=搞笑&sorttype=0&pn=0&rn=300&tag2=",
            "http://image.baidu.com/channel/imgs?c=美女&s=0&pn=0&rn=300&fr=channel&t=",
            "http://image.baidu.com/channel/imgs?c=汽车&s=0&pn=0&rn=300&fr=channel&t=",
            "http://image.baidu.com/channel/imgs?c=家居&s=0&pn=0&rn=300&fr=channel&t="];
        var url = geturl[kind] + tag;
        if (url.indexOf("listjson") > -1) {

            download(url, function (data) {
                var myjson = JSON.parse(data);
                var imglist = myjson.data;
                for (var i = 0; i < imglist.length - 1; i++) {

                    var imgobj = {};
                    imgobj.desc = imglist[i].desc;
                    imgobj.imgurl = imglist[i].download_url;
                    imgobj.w = imglist[i].image_width;
                    imgobj.h = imglist[i].image_height;
                    imgobj.bdid = imglist[i].id;
                    imgobj.bdtags = imglist[i].tags;
                    imgobj.kind = kind;
                    imgobj.tag = tag;
                    imgobj.date = imglist[i].date;
                    pimgMod.updateByUnique({ bdid: imgobj.bdid }, imgobj, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            })
        }
        if (url.indexOf("imgs") > -1) {
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
                    pimgMod.updateByUnique({ bdid: imgobj.bdid }, imgobj, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            })
        }
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
        var s_path = path.join(pimgpath + "s", d);
        var exist = fs.existsSync(new_path)
        if (!exist) {
            fs.mkdirSync(new_path);
            fs.mkdirSync(s_path);
        }
        for (var i = 0; i < result.length; i++) {
            var pimg = {};
            pimg.bdid = result[i].bdid;
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
            
            saveImg(pimg, _ipath, function (_pimg) {
                dimgMod.save(_pimg, function (err, _res) { });
                pimgMod.updateByUnique({ bdid: _pimg.bdid }, { enable: 1 }, function (err, __res) { });
            });
        }
        res.json({ res: 1 });
    });
}
exports.delNodown = function (req, res, next) {
    var query = {};
    query.enable = null;
    pimgMod.remove(query, function (err, result) {
        if (err) {
            res.json({ res: -1, msg: err });
            return;

        }
        res.json({ res: 1 });
    });
}
exports.thumbimg = function (req, res, next) {
    var query = {};
    query.thumb = null;

    dimgMod.getByQuery(query, {}, function (err, result) {
        if (err) {
            return next();
        }
        console.log(result.length);
        for (var i = 0; i < result.length; i++) {
            
            var oldsrc = path.join(pimgpath, result[i].src);
            var newsrc = path.join(pimgpath + "s", result[i].src);

            im.convert([oldsrc, '-resize', '208', newsrc],
            function (err, stdout) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            dimgMod.update(result[i]._id.toString(), { thumb: 1 }, function (err, __res) { });
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

function saveImg(pimg, name, callback) {

    var request = http.get(pimg.imgurl, function (res) {
        var imagedata = ''
        res.setEncoding('binary')

        res.on('data', function (chunk) {
            imagedata += chunk
        }).on('end', function () {
            fs.writeFile(name, imagedata, 'binary', function (err) {
                if (err) {
                    return;
                }
                if (imagedata.length > 100) {
                    callback(pimg);
                }

            })
        }).on('error', function (err) {
            console.log(url + err);
            return;
        });

    }).on('error', function (err) {
        console.log(name);
        return;
    });
}