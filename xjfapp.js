
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./route');
var http = require('http');
var path = require('path');
var config = require('./config.js').config;
var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('xiangjf'));
app.use(express.session());
app.use(express.bodyParser({ uploadDir: './public/myupload' }));



app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.set('static', config.static);
routes(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
