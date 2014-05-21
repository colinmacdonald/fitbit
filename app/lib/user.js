/*jshint node:true */

'use strict';

var user = exports;
exports.constructor = function() {};

var config = require('../config/env_vars');
var OAuth = require('oauth');
var Q = require('q');
var Signer = require('goinstant-auth').Signer;

user.create = function(profile) {
  var deferred = Q.defer();

  var signer = new Signer(config.goinstantAppSecret);

  var claims = {
    domain: 'fitbit',
    id: profile.id,
    displayName: profile._json.user.fullName,
    avatarUrl: profile._json.user.avatar150,
    gender: profile._json.user.gender,
    weight: profile._json.user.weight,
    groups: [
      {
        id: 'fitbit-auth',
        displayName: 'FitBit'
      }
    ]
  };

  signer.sign(claims, function(err, token) {
    if (err) {
      deferred.reject(err);
    }

      deferred.resolve(token);
  });

  return deferred.promise;
};

user.subscribe = function(token, tokenSecret, id) {
  var deferred = Q.defer();

  var oauth = new OAuth.OAuth(
    'https://api.fitbit.com/oauth/request_token',
    'https://api.fitbit.com/oauth/access_token',
    config.consumerKey,
    config.consumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
  );

    // Subscribe this application to updates from the user's data
    oauth.post(
      'https://api.fitbit.com/1/user/-/apiSubscriptions/' + id + '-all.json',
      token,
      tokenSecret,
      null,
      null,
      function (err, data, res){
        if (err) {
          throw err;
        }

        console.log("Subscription creation attempt results:", data);

        deferred.resolve(data);
      }
  );

  return deferred.promise;
};
