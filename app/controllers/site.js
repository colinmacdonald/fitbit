/*jshint node:true */

'use strict';

var site = exports;
exports.constructor = function() {};

var config = require('../config/env_vars');

site.index = function(req, res) {
  res.render('index', { user: req.user || '', connectUrl: config.connectUrl });
};
