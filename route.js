﻿var admin = require('./controller/admin.js');
var index = require('./controller/index.js');
var util = require('./controller/util.js');
var web = require('./controller/web.js');
var login = require('./controller/login.js');
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

    
    app.get('/', index.index);
    app.get('/cate/:cate', index.hotList, index.categoryList);
    app.get('/search',  index.searchList);
    app.get('/key_:key', index.hotList, index.searchList);
    app.get('/detail_:id', index.hotList, index.detail);
    app.get('*', function (req, res) {
        res.status(404);
        res.json({ res: "404" });
    })
}