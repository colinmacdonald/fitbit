/*jshint node:true */

'use strict';

exports = module.exports = User;

var config = require('../config/env_vars');
var OAuth = require('oauth');
var Q = require('q');
var Signer = require('goinstant-auth').Signer;
var goinstantClient = require('./goinstant_client');
var fitbitClient = require('./fitbit_client');

var TOKEN_KEY = 'tokens';

function User(token, tokenSecret, profile) {
  this.profile = profile;
  this.token = token;
  this.tokenSecret = tokenSecret;

  this.oauth = new OAuth.OAuth(
    'https://api.fitbit.com/oauth/request_token',
    'https://api.fitbit.com/oauth/access_token',
    config.fitbit.consumerKey,
    config.fitbit.consumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
  );
};

User.prototype.create = function() {
  var deferred = Q.defer();

  var signer = new Signer(config.goinstantAppSecret);

  var claims = {
    domain: 'fitbit',
    id: this.profile.id,
    displayName: this.profile._json.user.fullName,
    avatarUrl: this.profile._json.user.avatar150,
    gender: this.profile._json.user.gender,
    weight: this.profile._json.user.weight,
    groups: [
      {
        id: 'fitbit-auth',
        displayName: 'FitBit'
      }
    ]
  };

  var promises = [];

  promises.push(goinstantClient.set(TOKEN_KEY + '/' + this.profile.id, {
      token: this.token,
      tokenSecret: this.tokenSecret
    })
  );

  promises.push(fitbitClient.subscribe(
    this.profile.id, 'all', this.token, this.tokenSecret));

  Q.all(promises).then(function() {
    signer.sign(claims, function(err, token) {
      if (err) {
        deferred.reject(err);
      }

      deferred.resolve(token);
    });
  }).catch(function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};
