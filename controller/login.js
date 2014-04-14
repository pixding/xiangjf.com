var lib = require('../common/lib.js');
var config = require('../config.js').config;
var userMod = require('../models/user');
/** private function */
function gen_session(user, res) {
    var auth_token = lib.encrypt(user.name + '\t' + user.password, config.session_secret);
    res.cookie(config.cookie_secret, auth_token, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
}

// auth_user middleware
exports.auth_user = function (req, res, next) {
    if (req.session.user) {
        return next();
    }
    else {
        var cookie = req.cookies[config.cookie_secret];
        if (!cookie)
            return res.redirect('/admin/login');
        var auth_token = lib.decrypt(cookie, config.session_secret);
        var auth = auth_token.split('\t');
        var user_name = auth[0];
        userMod.get(user_name, function (err, user) {
            if (user) {
                req.session.user = user;
                return next();
            }
            else {
                return res.redirect('/admin/login');
            }
        });
    }
};

//admin/login
exports.login = function (req, res) {
    if (req.method == "GET") {
        res.render("admin/login", { layout: false,error:"" });
    }
    if (req.method == "POST") {
        var name = req.body.name.trim();
        var pass = req.body.pass.trim();
        console.log(lib.md5(pass));
        if (name == '' || pass == '') {
            res.render('admin/login', {
                layout: false,
                error: '信息不完整。'
            });
            return;
        }
        //判断用户帐号密码
        userMod.get(name, function (err, user) {
            if (user) {
                pass = lib.md5(pass);
                if (user.password != pass) {
                    res.render('admin/login', {
                        layout: false,
                        error: '密码错误。'
                    });
                    return;
                }
                gen_session(user, res);// store session cookie
                res.redirect('/admin/set/banner');
            } else {
                res.redirect('/admin/login');
            }
        });
    }
};

