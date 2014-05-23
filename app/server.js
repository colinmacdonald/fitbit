/*jshint node:true*/

'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var ejsLocals = require('ejs-locals');
var RedisStore = require('connect-redis')(express);
var passport = require('passport');

var config = require('./config/env_config');
var auth = require('./config/auth');
var routes = require('./config/routes');

var app = express();

app.configure(function() {
  app.set('env', process.env.NODE_ENV || 'local');
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', ejsLocals);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, '../static')));
  app.use(express.session({
    secret: config.sessionSecret,
    store: new RedisStore(config.redis)
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

auth.configure();
routes.configure(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
