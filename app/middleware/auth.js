/*jshint node:true */

'use strict';

var auth = exports;
exports.constructor = function() {};

var MSG_FAILURE = 'Failed to log in.';

auth.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login', { message: MSG_FAILURE });
};
