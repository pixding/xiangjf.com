var fs = require('fs');
var path = require('path');
var upload_path = path.join(path.dirname(__dirname), 'public/myupload');

exports.imgUpload = function (req, res, next) {
    var host = req.headers.host;
    var file = req.files.imgFile;
    var dom = req.query.dom||"";
    // sould use async
    if (file) {
        var name = file.name;
        var ext = path.extname(name);
        //var uid = req.session.user._id.toString();
        var time = new Date().getTime();
        var new_name = time + ext;
        var new_path = path.join(upload_path, new_name);
        fs.rename(file.path, new_path, function (err) {
            if (err) {
                return next(err);
            }
            var url = 'http://' + host + '/myupload/' + new_name;
            res.render("admin/util/upload.html", {
                layout: false,
                res: "",
                imgurl: url,
                dom:dom
            })
        });
    } else {
        res.render("admin/util/upload.html", {
            layout: false,
            res: "",
            imgurl: "出错了",
            dom:dom
        })
    }

};

exports.index = function (req, res, next) {
    var dom = req.query.dom || "";
    res.render("admin/util/upload.html", {
        layout: false,
        res: "",
        imgurl: "",
        dom:dom
    })
}