var path = require('path');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var http = require('http');
var EventProxy = require('eventproxy').EventProxy;
var needle = require('needle');
var upload_path = path.join(path.dirname(__dirname), 'xiangjf/public');

var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');




function saveImg(url, name) {

    var request = http.get(url, function (res) {
        var imagedata = ''
        res.setEncoding('binary')

        res.on('data', function (chunk) {
            imagedata += chunk
        })

        res.on('end', function () {
            fs.writeFile(name, imagedata, 'binary', function (err) {
                if (err) throw err
                console.log('File saved.')
            })
        })

    })
}

function download39(url) {
    download(url, function (data) {
        var myjson = JSON.parse(data);
        var imglist = myjson.data;
        for (var i = 0; i < imglist.length-1; i++) {
            var d = new Date();
            var ipath = "/pimg/bd" + imglist[i].id+ '.jpg';
            
            saveImg(imglist[i].download_url, upload_path + ipath);
            
        }
    })
}
function downloadxx(url) {
    download(url, function (data) {
        var myjson = JSON.parse(data);
        var imglist = myjson.imgs;
        for (var i = 0; i < imglist.length - 1; i++) {
            var d = new Date();
            var ipath = "/pimg/bd" + imglist[i].id + '.jpg';

            saveImg(imglist[i].downloadUrl, upload_path + ipath);

        }
    })
}
function downloadsoso(url) {
    download(url, function (data) {
        var myjson = JSON.parse(data);
        var imglist = myjson.items;
        for (var i = 0; i < imglist.length - 1; i++) {
            var d = new Date();
            var ipath = "/pimg/" + d.getTime() +""+ imglist[i].id+'.jpg';
            saveImg(imglist[i].pic_url, upload_path + ipath);

        }
    }, true);
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
function downloadtuniu(url) {
    for (var i = 0; i < 100000; i++) {
        (function (_i) {
            download(url, function (data) {
                if (data == null) {
                    console.log("error" + _i);
                } else {
                    console.log("success" + _i);
                }
            });
        })(i);
    }
}
//downloadsoso("http://image.soso.com/pics/channel/getRecomPicByTag.jsp?category=%E5%A3%81%E7%BA%B8&tag=%E5%85%A8%E9%83%A8&start=10&len=130&width=1366&height=768");

downloadtuniu("http://www.uzai.com/2212122");
//downloadxx("http://image.baidu.com/channel/imgs?c=%E7%BE%8E%E5%A5%B3&t=%E5%B0%8F%E6%B8%85%E6%96%B0&s=0&pn=120&rn=60&fr=channel");
//download39("http://image.baidu.com/channel/listjson?pn=0&rn=200&tag1=%E6%98%8E%E6%98%9F&tag2=%E5%88%98%E8%AF%97%E8%AF%97&ftags=&sorttype=0&ie=utf8&oe=utf-8");