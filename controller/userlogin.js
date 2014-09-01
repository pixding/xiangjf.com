var lib = require('../common/lib.js');
var config = require('../config.js').config;
var uuserMod = require('../models/u/user');
/** private function */
function gen_session(user, res) {
    var auth_token = lib.encrypt(user.email + '\t' + user.password, config.usersession);
    res.cookie(config.usercookie, auth_token, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
}
exports.gen_session = gen_session;

// auth_user middleware
exports.auth_user = function (req, res, next) {
    if (req.session.comuser) {
        return next();
    }
    else {
        var cookie = req.cookies[config.usercookie];
        if (!cookie)
            return res.redirect('/u/login');
        var auth_token = lib.decrypt(cookie, config.usersession);
        var auth = auth_token.split('\t');
        var user_email = auth[0];
        uuserMod.findOne({email:user_email}, function (err, user) {
            if (user) {
                req.session.comuser = user;
                return next();
            }
            else {
                return res.redirect('/u/login');
            }
        });
    }
};

exports.mid_user = function(req,res,next){
    var comuser;
    if(req.session.comuser){
        comuser = req.session.comuser;
        res.locals.current_user = comuser;
        next();
    }else{
        var cookie = req.cookies[config.usercookie];
        if(!cookie){
            return next()
        }
        var auth_token = lib.decrypt(cookie, config.usersession);
        var auth = auth_token.split('\t');
        var user_email = auth[0];
        uuserMod.findOne({email:user_email}, function (err, user) {
            if (user) {
                comuser = req.session.comuser = user;
                res.locals.current_user = comuser;
                next();
            }
            else {
                next();
            }
        });
    }
}





