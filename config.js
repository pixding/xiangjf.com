var mongoskin = require('mongoskin');
var dateFormat = require('dateformat');

var config = {
    session_secret: 'session_xiangjf',
    cookie_secret: 'cookie_xiangjf',
    port: 3001,
    theme: 'theme/default/',
    mailopts: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'xiangjf01@126.com',
            pass: '01xiangjf'
        }
    },
    host:'localhost:3001'
}
config.static = {
    name: 'xiangjf',
    pagesize: 20,
    listsize:40,
    method: {
        getDate: function (d) {
            return dateFormat(d, "yyyy-mm-dd");
        },
        initimg: function (img, w, h) {
            if (img) {
                if (w / h > img.w / img.h) {
                    img.h = w / img.w * img.h;
                    img.w = w;
                    img.dis = (img.h - h) * -0.5;
                    img.margin = "top";
                } else {
                    img.w = h / img.h * img.w;
                    img.h = h;
                    img.dis = (img.w - w) * -0.5;
                    img.margin = "left";
                }
            } else {

            }

        }
    }
}
config.static.category = ['请选择', '运动减肥', '饮食减肥', '局部减肥', '减肥常识', '减肥案例'];
config.static.searchKey = ['瘦脸','瘦大腿','收腹肚腩','丰胸美胸','减肚子','瘦腿最有效的方法','小腿水肿','健美操', '燃烧脂肪','春季减肥','水果减肥','女人我最大', '丰胸秘籍','瘦腿运动','春季减肥'];
config.static.pimgkind = ['请选择', '明星', '搞笑', '美女', '汽车', '家居'];
exports.config = config;
exports.db = mongoskin.db("mongodb://127.0.0.1/xiangjfon");


