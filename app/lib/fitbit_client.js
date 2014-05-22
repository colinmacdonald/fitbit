/*jshint node:true */

'use strict';

var fitbitClient = exports;

var config = require('../config/env_vars');
var OAuth = require('oauth');
var Q = require('q');
var Signer = require('goinstant-auth').Signer;
var goinstantClient = require('./goinstant_client');

var TOKEN_KEY = 'tokens';

var oauth = this.oauth = new OAuth.OAuth(
  'https://api.fitbit.com/oauth/request_token',
  'https://api.fitbit.com/oauth/access_token',
  config.fitbit.consumerKey,
  config.fitbit.consumerSecret,
  '1.0',
  null,
  'HMAC-SHA1'
);

fitbitClient.subscribe = function(id, category, token, tokenSecret) {
  var deferred = Q.defer();

  // Subscribe this application to updates from the user's data
  oauth.post(
    'https://api.fitbit.com/1/user/-/apiSubscriptions/' + id + '-' + category + '.json',
    token,
    tokenSecret,
    null,
    null,
    function (err, data, res) {
      if (err && err.statusCode !== 200) {
        deferred.reject(new Error('Subscribe Failed: code ' + err.statusCode));
        return console.log('ERROR: statusCode ', err.statusCode);
      }

      console.log('Subscription created');

      deferred.resolve(data);
    }
  );

  return deferred.promise;
};

fitbitClient.getCategoryData = function(id, category, date) {
  var deferred = Q.defer();

  goinstantClient.get(TOKEN_KEY + '/' + id).then(function(tokens) {
    console.log('tokens', tokens);
    oauth.get(
      'https://api.fitbit.com/1/user/-/' + category + '/date/' + date + '.json',
      tokens.token,
      tokens.tokenSecret,
      function(err, data, res) {
        if (err && err.statusCode !== 200) {
          deferred.reject(new Error('Fetch Failed: code ' + err.statusCode));
          return console.log('ERROR: statusCode ', err.statusCode);
        }

        var value = JSON.parse(data);
        console.log('STEPS ', value.summary.steps);
        console.log('GOAL ', value.goals.steps);

        deferred.resolve(value);
      }
    );
  }).catch(function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};
