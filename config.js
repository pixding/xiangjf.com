var mongoskin = require('mongoskin');
var dateFormat = require('dateformat');

var config = {
    session_secret: 'session_xiangjf',
    cookie_secret: 'cookie_xiangjf',
    port: 3001,
    theme: 'theme/default/'
}
config.static = {
    name: 'xiangjf',
    pagesize: 20,
    listsize:40,
    method: {
        getDate: function (d) {
            return dateFormat(d, "yyyy-mm-dd");
        }
    }
}
config.static.category = ['请选择', '运动减肥', '饮食减肥', '局部减肥', '减肥常识', '减肥案例'];
config.static.searchKey = ['瘦脸','瘦大腿','收腹肚腩','丰胸美胸','减肚子','瘦腿最有效的方法','小腿水肿','健美操', '燃烧脂肪','春季减肥','水果减肥','女人我最大', '丰胸秘籍','瘦腿运动','春季减肥'];
config.static.pimgkind = ['请选择', '明星', '搞笑', '美女', '汽车', '家居'];
exports.config = config;
exports.db = mongoskin.db("mongodb://127.0.0.1/xiangjf");