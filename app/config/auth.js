/*jshint node:true */

'use strict';

var auth = exports;
exports.constructor = function auth() {};

var Q = require('q');

var config = require('./env_config');
var passport = require('passport');
var FitbitStrategy = require('passport-fitbit').Strategy;
var ForceDotComStrategy = require('passport-forcedotcom').Strategy;

var User = require('../lib/user');

auth.configure = function() {
  passport.serializeUser = function(result, done) {
    done(null, result);
  };

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new FitbitStrategy(config.fitbit, function(token, tokenSecret, profile, done) {
    var promises = [];

    var user = new User(token, tokenSecret, profile);

    promises.push(user.create());

    Q.all(promises).then(function(results) {
      var session = {
        jwt: results[0],
        id: profile.id
      };

      return done(null, session);
    });
  }));

  passport.use(new ForceDotComStrategy(config.forcedotcom, function(token, tokenSecret, profile, done) {
    console.log(profile);
    return done(null, profile);
  }));
};
