
/*
 * GET home page.
 */
var config = require('../../config.js').config;
var uuserMod = require('../../models/u/user');
var lib = require('../../common/lib.js');
var mailer = require('../../common/mail.js');
var userlogin = require('../../controller/userlogin.js')

//注册
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

        var ts = new Date().getTime().toString();
        newUserMod.token = lib.md5(ts);

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
                uuserMod.insert(newUserMod, function (err) {
                    if (err) {
                        return next();
                    }
                    mailer.sendActiveMail(newUserMod, newUserMod.token);
                    res.redirect('/u/regactive?email=' + newUserMod.email);
                });
            }
        });

    }
}

//登录
exports.login = function (req, res) {
    if (req.method == "GET") {
        res.render(config.theme + 'login', { layout: false,error:"" });
    }
    if (req.method == "POST") {
        var email = req.body.email.trim();
        var pass = req.body.pass.trim();
        if (email == '' || pass == '') {
            res.render(config.theme + 'login', {
                layout: false,
                error: '信息不完整。'
            });
            return;
        }
        //判断用户帐号密码
        uuserMod.findOne({email:email}, function (err, user) {
            if (user) {
                pass = lib.md5(pass);
                if (user.password != pass) {
                    res.render(config.theme + 'login', {
                        layout: false,
                        error: '密码错误。'
                    });
                    return;
                }
                userlogin.gen_session(user, res);// store session cookie
                res.redirect('/');
            } else {
                res.render(config.theme + 'login',  {
                    layout: false,
                    error: '用户不存在。'
                });
            }
        });
    }
};

//注册完成
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
//验证邮箱
exports.validateAccount = function (req, res, next) {
    var email = req.body.email;
    var type = req.query.type;
    uuserMod.findOne({ email: email }, function (err,result) {
        if (err) {
            return next();
        }
        if (result) {
            if(type=="login"){
                res.send("true");
            }else {
                res.send("false");
            }
        }else{
            if(type=="login"){
                res.send("false");
            }else {
                res.send("true");
            }
        }
    });
}

exports.regsuccess = function (req, res, next) {
    var email = req.query.account||"";
    var token = req.query.key||"";
    var errmsg = 1;

    uuserMod.findOne({email:email,token:token},function(err,result){
        if(err){
            return next();
        }
        if(result){
            uuserMod.update({ email: email}, { active: true }, function (err){
                if(err){
                    return next();
                }
                errmsg = 1;
                res.render(config.theme + 'regsuccess', { layout: false, errmsg: errmsg });
            });
        }else{
            errmsg = -2;
            res.render(config.theme + 'regsuccess', { layout: false, errmsg: errmsg });
        }
    })
}

// logout
exports.logout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.usercookie, { path: '/' });
    res.redirect(req.headers.referer || '/');
};
