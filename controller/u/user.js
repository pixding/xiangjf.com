
/*
 * GET home page.
 */
var config = require('../../config.js').config;
var uuserMod = require('../../models/u/user');
var lib = require('../../common/lib.js');
var mailer = require('../../common/mail.js');

exports.register = function (req, res, next) {
    if (req.method == "GET") {
        res.render(config.theme + 'register', { layout: false, error: [] });
    }
    if (req.method == "POST") {
        var errorObj = [];
        var newUserMod = {};
        newUserMod.email = req.body.email||"";
        newUserMod.nickname = req.body.nickname || "";
        
        newUserMod.sex = parseInt(req.body.sex) || 0;
        newUserMod.password = req.body.password || "";
        newUserMod.active = false;

        if (!lib.emailReg.test(newUserMod.email)) {
            errorObj.push("您输入的邮箱格式不正确");
        }
        if (newUserMod.nickname.length < 2 || newUserMod.nickname.length > 14) {
            errorObj.push("您的昵称长度需在4-14个字符之间");
        }
        if (newUserMod.password.length < 6 || newUserMod.password.length > 16) {
            errorObj.push("密码长度需在6-16个字符之间");
        }
        if (!newUserMod.sex) {
            errorObj.push("您还没有选择性别");
        }
        if (errorObj.length > 0) {
            console.log(errorObj);
            res.render(config.theme + 'register', { layout: false, error: errorObj });
        }
        newUserMod.password = lib.md5(newUserMod.password);
        uuserMod.findOne({ email: newUserMod.email }, function (err, result) {
            if (err) {
                return next();
            }
            if (result) {
                res.render(config.theme + 'register', { layout: false, error: ["该邮箱已被注册，<a href='#'>立即登陆</a>"] });

            } else {
                uuserMod.insert(newUserMod, function (err, usr) {
                    if (err) {
                        return next();
                    }
                    mailer.sendActiveMail(newUserMod, "222223333344444");
                    res.redirect('/u/registersuc?email=' + newUserMod.email, { layout: false });
                });
            }
        });

    }
}

exports.regactive = function (req, res, next) {
    var email = req.query.email;
    uuserMod.findOne({ email: email }, function (err, result) {
        if (err) {
            return next();
        }
        if (!result) {
            return next();
        }
        res.render(config.theme + 'regactive', { layout: false, result: result });
    });
}
exports.validateAccount = function (req, res, next) {
    var email = req.body.email;
    uuserMod.findOne({ email: email }, function (err,result) {
        if (err) {
            return next();
        }
        if (result) {
            res.send("false");
        }else{
            res.send("true");
        }
    });
}
