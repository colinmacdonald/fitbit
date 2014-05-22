/* jshint node:true */

'use strict';

var goinstantClient = exports;

var config = require('../config/env_vars');
var Q = require('q');
var _ = require('lodash');
var GoInstant = require('goinstant-rest').v1;

var APP_NAME = 'fitbit';
var ROOM_NAME = 'fitbit-lobby';
var NOTIFY_CHANNEL_NAME = 'fitbit/sync-notifications';
var TOKEN_KEY_NAME = 'fitbit/tokens';

var OPTS = {
  app_id: APP_NAME,
  room_id: ROOM_NAME,
  create_room: true
};

var client = new GoInstant({
  client_id: config.goinstantClientId,
  client_secret: config.goinstantClientSecret
});

exports.constructor = function() {};

goinstantClient.notifySync = function(value) {
  var deferred = Q.defer();
  var opts = _.clone(OPTS);

  _.extend(opts, {
    channel: NOTIFY_CHANNEL_NAME,
    value: value
  });

  client.channels.message(opts, function(err, value) {
    if (err) {
      deferred.reject(err);

      return console.log(err);
    }

    deferred.resolve(value);
  });

  return deferred.promise;
};

goinstantClient.setUserTokens = function(id, token, tokenSecret) {
  var deferred = Q.defer();
  var opts = _.clone(OPTS);

  _.extend(opts, {
    key: TOKEN_KEY_NAME + '/' + id,
    value: {
      token: token,
      tokenSecret: tokenSecret
    }
  });

  client.keys.update(opts, function(err, value) {
    if (err) {
      deferred.reject(err);

      return console.log(err);
    }

    deferred.resolve(value);
  });

  return deferred.promise;
};

goinstantClient.getUserTokens = function(id) {
  var deferred = Q.defer();
  var opts = _.clone(OPTS);

  _.extend(opts, {
    key: TOKEN_KEY_NAME + '/' + id
  });

  client.keys.get(opts, function(err, result) {
    if (err) {
      deferred.reject(err);

      return console.log(err);
    }

    deferred.resolve(result.value);
  });

  return deferred.promise;
};
