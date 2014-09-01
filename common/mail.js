var mailer = require('nodemailer');
var config = require('../config').config;

var transport = mailer.createTransport(config.mailopts);
var url = "http://" + config.host;

/*发送邮件*/
var sendMail = function (data) {
    transport.sendMail(data, function (err) {
        if (err) {
            console.log("mailerror:" + err);
        }
    });
}

/*发送激活邮件*/
exports.sendActiveMail = function (who, token) {
    var from = config.mailopts.auth.user;
    var to = who.email;
    var subject = "想减肥帐号激活";
    var html = [];
    var tokenurl = url + '/u/regsuccess?account=' + who.email + '&key=' + token;
    html.push('<p>您好,' + who.nickname + ':</p>');
    html.push('<p>感谢您注册想减肥。</p>');
    html.push('<p>请点击下面的链接激活您的帐号，完成注册。</p>');
    html.push('<p><a href="' + tokenurl + '">' + tokenurl + '</a></p>');
    html.push('<p>(如果点击链接没有反应，请复制激活链接，粘贴到浏览器地址栏后访问)</p>');

    sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html.join('')
    });
}