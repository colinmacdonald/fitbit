/*jshint node:true */

'use strict';

var auth = exports;
exports.constructor = function auth() {};

var Q = require('q');

var config = require('./env_vars');
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit').Strategy;
var ForceDotComStrategy = require('passport-forcedotcom').Strategy;

var user = require('../lib/user');

auth.configure = function() {
  passport.serializeUser = function(result, done) {
    done(null, result);
  };

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new FitbitStrategy(config.fitbit, function(token, tokenSecret, profile, done) {
    var promises = [];

    promises.push(user.create(profile));
    promises.push(user.subscribe(token, tokenSecret, profile.id));

    Q.all(promises).then(function(results) {
      return done(null, results[0]);
    });
  }));

  passport.use(new ForceDotComStrategy(config.forcedotcom, function(token, tokenSecret, profile, done) {
    console.log(profile);
    return done(null, profile);
  }));
};
