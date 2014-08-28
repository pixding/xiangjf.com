var admin = require('./controller/admin.js');
var util = require('./controller/util.js');
var web = require('./controller/web.js');
var login = require('./controller/login.js');
var pimg = require('./controller/pimg.js');

var u_user = require('./controller/u/user.js');

var index = require('./controller/index.js');
var index_img = require('./controller/index-img.js');
var config = require('./config.js').config;
exports = module.exports = function (app) {
    app.get('/admin/login', login.login);
    app.post('/admin/login', login.login);

    app.get('/admin/post/list',login.auth_user, admin.postList);
    app.get('/admin/post/i-list', login.auth_user, admin.postListSel);
    app.get('/admin/post/add', login.auth_user, admin.postAdd);
    app.get('/admin/post/edit:id', login.auth_user, admin.postEdit);
    app.get('/admin/post/pedit:id', login.auth_user, admin.postpEdit);
    app.get('/admin/post/get', login.auth_user, admin.postGet);
    app.post('/admin/post/add', login.auth_user, admin.postAdd);
    app.post('/admin/post/edit:id', login.auth_user, admin.postEdit);
    app.post('/admin/post/delete', login.auth_user, admin.postDelete);
    app.post('/admin/post/pedit:id', login.auth_user, admin.postpEdit);
    app.post('/admin/post/get', login.auth_user, admin.postGet);

    app.get('/admin/post/lady', login.auth_user, admin.postLady);
    app.post('/admin/post/lady', login.auth_user, admin.postLady);
    app.post('/admin/post/syncLady', login.auth_user, admin.syncLady);

    app.get('/admin/util/imgupload', login.auth_user, util.index);
    app.post('/admin/util/imgupload', login.auth_user, util.imgUpload);

    app.get('/admin/set/banner', login.auth_user, web.banner);
    app.post('/admin/set/banner', login.auth_user, web.postBanner);
    app.get('/admin/set/hpost', login.auth_user, web.hpost);
    app.post('/admin/set/hpost', login.auth_user, web.hpost);

    
    app.get('/admin/pimg/pull', login.auth_user, pimg.getImg);
    app.post('/admin/pimg/pull', login.auth_user, pimg.getImg);
    app.post('/admin/pimg/downloadimg', login.auth_user, pimg.downloadimg);
    app.get('/admin/pimg/list', login.auth_user, pimg.getdImg);
    app.post('/admin/pimg/downsingle', login.auth_user, pimg.singleDown);
    app.post('/admin/pimg/thumbimg', login.auth_user, pimg.thumbimg);
    app.post('/admin/pimg/delnodown', login.auth_user, pimg.delNodown);

    app.get('/', index.index);
    app.get('/cate/:cate', index.hotList, index.categoryList);
    app.get('/search',  index.searchList);
    app.get('/key_:key', index.hotList, index.searchList);
    app.get('/detail_:id', index.hotList, index.detail);
    app.get('/pins', index_img.imgindex);
    app.get('/pins_:kind', index_img.pins);
    app.get('/pins/data', index_img.pinsdata);
    app.get('/pins/detail_:id', index_img.pinsdetail);


    app.get('/u/register', u_user.register);
    app.post('/u/register', u_user.register);
    app.get('/u/regactive', u_user.regactive);
    app.post('/u/validateAccount', u_user.validateAccount);

    app.get('/testjs', function (req, res, next) {
        res.render(config.theme + 'testjs', { layout: false });
    });

    app.get('/lvyouquan',index.q);

    app.get('*', function (req, res) {
        res.status(404);
        res.json({ res: "404" });
    })
}
