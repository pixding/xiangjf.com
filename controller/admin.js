var postMod = require('../models/post');
var ladyMod = require('../models/lady');
var dateFormat = require('dateformat');
var lib = require('../common/lib.js');
var config = require('../config.js').config;

var path = require('path');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var http = require('http');
var EventProxy = require('eventproxy').EventProxy;
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite');
var upload_path = path.join(path.dirname(__dirname), 'public');

exports.postLady = function (req, res, next) {
    if (req.method == "GET") {
        var cateType = req.query.type || "";

        var page = req.query.page || 1;
        var limit = config.static.pagesize;
        var query = {};
        if (cateType) {
            query.category = parseInt(cateType, 10);
        }
        ladyMod.count(query, function (err, count) {
            if (err) {
                next();
            }
            var totalpage = Math.ceil(count / limit) || 1;
            if (page > totalpage) {
                page = totalpage;
            }
            ladyMod.getByQuery(query, { skip: (page - 1) * limit, limit: limit, sort: { enable: 1 } }, function (err, result) {
                if (err) {
                    return next();
                }
                res.render("admin/post/lady", { layout: false, type: cateType, list: result, page: page, total: count });
            });
        });
    } 
    if (req.method == "POST") {
        var cate =  req.body.cate;
        if (!cate) {
            res.json({ res: -1, msg: "未所分类" });
        }
        cate = parseInt(cate, 10);
        var urllist = ["", "http://www.lady8844.com/shoushen/ydss/", "http://www.lady8844.com/shoushen/ccmt/", "http://www.lady8844.com/shoushen/jbss/", "http://www.lady8844.com/shoushen/jfcs/", "http://www.lady8844.com/shoushen/jfjy/"];
        var _downurl = urllist[cate];
        if (!_downurl) {
            res.json({ res: -1, msg: "链接不存在" });
        }
        download(_downurl, function (data) {
            var $ = cheerio.load(data);
            var postlist = [];
            var jlist = $(".hotArt li,.ArtList li");
            for (var i = 0; i < jlist.length; i++) {
                var lady = {};
                lady.category = cate;
                lady.syncTime = dateFormat(new Date(), "yyyy-mm-dd");
                lady.getUrl = $(jlist[i]).find("a").attr("href");
                lady.title = $(jlist[i]).find("a").text();
                ladyMod.updateByUnique(lady.getUrl, lady, function (err, rlt) {
                    
                });
            }
            res.json({ res: 1 });

        });

    }
}

exports.syncLady = function (req, res, next) {
    var cate = req.body.cate;
    if (!cate) {
        res.json({ res: -1, msg: "未选择分类" });
    }
    cate = parseInt(cate, 10);
    var query = {};
    query.category = cate;
    query.enable = null;
    ladyMod.getByQuery(query, {}, function (err, result) {
        if (err) {
            return next();
        }
        for (var i = 0; i < result.length; i++) {
            var post = {};

            post.author = "admin";
            post.tags = [];
            post.enable = 1;
            post.category = result[i].category;
            _url = result[i].getUrl;
            (function (_url, post, _i) {
                download8844(_url, post, function (p) {
                    postMod.save(p, function (err, result) {
                        if (err) {
                            
                        } else {

                            ladyMod.updateByUnique(_url, {enable:1}, function (err, rlt) {
                            });
                        }
                    });
                });
            })(_url, post, i);

        }
        res.json({ res: 1 });
    });
}


//lady8844内容
function download8844(url, post, cb) {
    download(url, function (data) {
        var $ = cheerio.load(data);
        if ($(".article-guide").length == 1) {

            post.title = $("h1").text();
            post.createDate = _trim($(".article-info span").eq(0).text()).substring(0, 10);
            post.desc = $(".article-guide").text().replace('导语：', '');
            var _s = [];
            $(".article-relspecial a").each(function () {
                _s.push($(this).text());
            });
            post.tags = _s;
            var page = parseInt($(".page-next").prev().text());
            var content = $("#article-content");
            var imglist = content.find("img");
            var ep = new EventProxy();

            ep.after('got_file', imglist.length, function () {
                content.find("a").each(function () {
                    $(this).after($(this).text());
                });
                content.find("a").remove();
                post.content = $("#article-content").html();


                var pageEvent = new EventProxy();
                pageEvent.after('got_pagecontent', page - 1, function (list) {
                    list.sort(function (a, b) {
                        return a.index > b.index ? 1 : -1;
                    });
                    post.pageContent = list;
                    cb(post);
                });
                var _url = url.replace(".html", "");
                for (var j = 1; j < page; j++) {

                    (function (_j) {
                        load8844PageContent2(_url + "_" + _j + ".html", function (data) {
                            var pagecon = {};
                            pagecon.index = _j;
                            pagecon.data = data;
                            pageEvent.emit('got_pagecontent', pagecon);
                        })
                    })(j);


                }
            });
            for (var i = 0; i < imglist.length; i++) {
                var src = $(imglist[i]).attr('src');
                var d = new Date();
                var ipath = "/upload/" + d.getTime() + '.jpg';
                saveImg(src, upload_path + ipath);
                $("#article-content").find("img").eq(i).parents("p").html("<img src='" + ipath + "' />");
                ep.emit('got_file');
            }

        } else {

            post.title = $("#TEXT_TITLE").text();
            post.createDate = _trim($(".time2").text()).substring(0, 10);
            post.desc = $(".guide_txt").text().replace('导语：', '');
            var _s = [];
            $(".hotT").parent(".tag_txt").find("a").each(function () {
                _s.push($(this).text());
            });
            post.tags = _s;
            var page = parseInt($(".down_class").prev().text());
            var content = $("#TEXT_CONTENT");
            var imglist = content.find("img");
            var ep = new EventProxy();

            ep.after('got_file', imglist.length, function () {
                content.find("a").each(function () {
                    $(this).after($(this).text());
                });
                content.find("a").remove();
                post.content = $("#TEXT_CONTENT").html();


                var pageEvent = new EventProxy();
                pageEvent.after('got_pagecontent', page - 1, function (list) {
                    list.sort(function (a, b) {
                        return a.index > b.index ? 1 : -1;
                    });
                    post.pageContent = list;
                    cb(post);
                });
                var _url = url.replace(".html", "");
                for (var j = 1; j < page; j++) {

                    (function (_j) {
                        load8844PageContent(_url + "_" + _j + ".html", function (data) {
                            var pagecon = {};
                            pagecon.index = _j;
                            pagecon.data = data;
                            pageEvent.emit('got_pagecontent', pagecon);
                        })
                    })(j);


                }
            });
            for (var i = 0; i < imglist.length; i++) {
                var src = $(imglist[i]).attr('src');
                var d = new Date();
                var ipath = "/upload/" + d.getTime() + '.jpg';
                saveImg(src, upload_path + ipath);
                $("#TEXT_CONTENT").find("img").eq(i).parents("p").html("<img src='" + ipath + "' />");
                ep.emit('got_file');
            }
        }

    });
}

function load8844PageContent2(url, cb) {
    var pageContent = "";
    download(url, function (data) {
        var $ = cheerio.load(data);
        var content = $("#article-content");
        var imglist = content.find("img");
        var ep = new EventProxy();
        ep.after('got_file', imglist.length, function () {
            pageContent = $("#article-content").html();
            cb(pageContent);

        });
        for (var i = 0; i < imglist.length; i++) {
            var src = $(imglist[i]).attr('src');
            var d = new Date();
            var ipath = "/upload/" + d.getTime() + '.jpg';
            saveImg(src, upload_path + ipath);
            //request(src).pipe(fs.createWriteStream(upload_path + ipath));
            $("#article-content").find("img").eq(i).parents("p").html("<img src='" + ipath + "' />");
            ep.emit('got_file');
        }

    });
}
function load8844PageContent(url, cb) {
    var pageContent = "";
    download(url, function (data) {
        var $ = cheerio.load(data);
        var content = $("#TEXT_CONTENT");
        var imglist = content.find("img");
        var ep = new EventProxy();
        ep.after('got_file', imglist.length, function () {
            pageContent = $("#TEXT_CONTENT").html();
            cb(pageContent);

        });
        for (var i = 0; i < imglist.length; i++) {
            var src = $(imglist[i]).attr('src');
            var d = new Date();
            var ipath = "/upload/" + d.getTime() + '.jpg';
            saveImg(src, upload_path + ipath);
            //request(src).pipe(fs.createWriteStream(upload_path + ipath));
            $("#TEXT_CONTENT").find("img").eq(i).parents("p").html("<img src='" + ipath + "' />");
            ep.emit('got_file');
        }

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
                if (err) return;
            })
        })
        res.on('error', function (err) {
            console.log(url + err);
            return;
        });

    })
}
//文章列表
exports.postList = function (req, res, next) {
    var page = req.query.page || 1;
    var category =parseInt( req.query.category,10) || 0;
    var key = req.query.key || "";
    var query = {};
    if (category>0) {
        query.category = category;
    }
    if (key) {
        var title = new RegExp("^.*" + key + ".*$");
        query.title = title;
    }
    page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    var limit = config.static.pagesize;


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
            res.render("admin/post/list", { layout: false,category:category,key:key, list: result, page: page, total: count });
        });
    });
}
//文章列表
exports.postListSel = function (req, res, next) {
    var page = req.query.page || 1;
    var category = parseInt(req.query.category, 10) || 0;
    var key = req.query.key || "";
    var query = {};
    if (category > 0) {
        query.category = category;
    }
    if (key) {
        var title = new RegExp("^.*" + key + ".*$");
        query.title = title;
    }
    var callback = req.query.callback || "";
    page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    var limit = config.static.pagesize;

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
            res.render("admin/post/i-list", { layout: false, category: category, key: key, callback: callback, list: result, page: page, total: count });
        });
    });
}


//添加文章
exports.postAdd = function (req, res, next) {
    if (req.method == "GET") {
        res.render("admin/post/add", { layout: false });
    }
    if (req.method == "POST") {
        var createDate = dateFormat(new Date(), "yyyy-mm-dd");
        if (req.body.pubdate) {
            createDate = dateFormat(req.body.pubdate, "yyyy-mm-dd");
        }
        var post = {
            title: req.body.title,
            desc: req.body.desc,
            tags: req.body.tags.split(','),
            category: req.body.category,
            content: req.body.content,
            author:req.body.author,
            enable: 1,
            createDate: createDate,
            pageContent:[]
        };
        postMod.save(post, function (err, result) {
            if (err) {
                res.json({ res: -1, msg: err });
            }
            res.json({ res: 1 });
        });
    }
}

//更新文章
exports.postEdit = function (req, res, next) {
    var id = req.params.id;
    if (req.method == "GET") {
        postMod.getById(id, function (err, result) {
            if (err) {
                return next();
            }
            res.render("admin/post/edit", { layout: false, post: result});
        });
    }
    if (req.method == "POST") {
        var createDate = dateFormat(new Date(), "yyyy-mm-dd");
        if (req.body.pubdate) {
            createDate = dateFormat(req.body.pubdate, "yyyy-mm-dd");
        }
        var post = {
            title: req.body.title,
            desc: req.body.desc,
            tags: req.body.tags.split(','),
            category: req.body.category,
            content: req.body.content,
            author: req.body.author,
            createDate: createDate
        };
        postMod.update(id, post, function (err, result) {
            if (err) {
                res.json({ res: -1, msg: err });
            }
            res.json({ res: 1 });
        });
    }
}
//更新文章分页内容
exports.postpEdit = function (req, res, next) {
    var id = req.params.id;
    if (req.method == "GET") {
        postMod.getById(id, function (err, result) {
            if (err) {
                return next();
            }
            res.render("admin/post/pedit", { layout: false, post: result });
        });
    }
    if (req.method == "POST") {
        var pageContent = req.body.content;
        var post = {};
        post.pageContent = [];
        if ((typeof pageContent == 'string') && pageContent.constructor == String) {
            var pagecon = {};
            pagecon.index = 1;
            pagecon.data = pageContent;
            post.pageContent.push(pagecon);
        }
        if ((typeof pageContent == 'object') && pageContent.constructor == Array) {
            for (var i = 0; i < pageContent.length; i++) {
                var pagecon = {};
                pagecon.index = i + 1;
                pagecon.data = pageContent[i];
                post.pageContent.push(pagecon);
            }
        }
        
        postMod.update(id, {"pageContent":post.pageContent}, function (err, result) {
            if (err) {
                res.json({ res: -1, msg: err });
            }
            res.json({ res: 1 });
        });
    }
}

//移除文章
exports.postDelete = function (req, res, next) {
    var id = req.body.id;
    if (id) {
        postMod.removeById(id, function (err, result) {
            if (err) {
                res.json({ res: -2 });
            }
            res.json({ res: 1 });
        });
    } else {
        res.json({ res: -1 });
    }
}

exports.postGet = function (req, res, next) {
    if (req.method == "GET") {
        res.render("admin/post/get", { layout: false });
    }
    if (req.method == "POST") {
        var type = req.body.type;
        var url = req.body.url;
        var post = {};
        post.category = req.body.category;
        post.tags = [];
        post.enable = "1";
        
        download8844(url, post, function (p) {
            postMod.save(p, function (err, result) {
                if (err) {
                    res.json({ res: -1, msg: err });
                }
                res.json({ res: 1 });
            });
        });
    }

}



function download(url,callback,isgbk) {
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

function _trim(s) {
    return s.replace(/^\s+|\s+$/g, "");
}






