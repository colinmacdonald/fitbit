/*jshint node:true */

'use strict';

var url = require('url');

var ENV = process.env;

var config = {
  fitbit: {
    consumerKey: ENV.FITBIT_CONSUMER_KEY,
    consumerSecret: ENV.FITBIT_CONSUMER_SECRET,
    callbackUrl: ENV.FITBIT_CALLBACK_URL,
  },
  forcedotcom: {
    clientID: ENV.FORCEDOTCOM_CONSUMER_KEY,
    clientSecret: ENV.FORCEDOTCOM_CONSUMER_SECRET,
    scope: ENV.FORCEDOTCOM_SCOPE || ['id', 'chatter_api'],
    callbackURL: ENV.FORCEDOTCOM_CALLBACK_URL
  },
  connectUrl: ENV.GOINSTANT_CONNECT_URL,
  goinstantAppSecret: ENV.GOINSTANT_APP_SECRET,
  goinstantClientId: ENV.GOINSTANT_CLIENT_ID,
  goinstantClientSecret: ENV.GOINSTANT_CLIENT_SECRET,
  sessionSecret: ENV.SESSION_SECRET
};

var redisParse = url.parse(ENV.REDIS_URL || ENV.REDISCLOUD_URL);

config.redis = {
  host: redisParse.hostname,
  port: redisParse.port,
  pass: redisParse.auth ? redisParse.auth.split(':')[1] : null
};

module.exports = config;
