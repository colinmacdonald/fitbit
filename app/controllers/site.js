/*jshint node:true */

'use strict';

var site = exports;
exports.constructor = function() {};

var config = require('../config/env_vars');

site.index = function(req, res) {
  var jwt = req.user ? req.user.jwt : '';

  res.render('index', { jwt: jwt, connectUrl: config.connectUrl });
};

site.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
