/*jshint node:true */

'use strict';

var fitbitAPI = exports;
exports.constructor = function() {};

var fs = require('fs');
var multiparty = require('multiparty');
var GoInstant = require('goinstant-rest').v1;
var config = require('../config/env_vars');

var APP_NAME = 'fitbit';
var ROOM_NAME = 'fitbit-lobby';
var CHANNEL_NAME = 'fitbit/sync-notifications';

var client = new GoInstant({
  client_id: config.goinstantClientId,
  client_secret: config.goinstantClientSecret
});

fitbitAPI.notifications = function(req, res) {
  res.send(204);

  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if (err) {
      return console.log(err);
    }

    var path = files.updates[0].path;

    fs.readFile(path, { encoding: 'utf8' }, function(err, data) {
      if (err) {
        return console.log(err);
      }

      var time = Date.now();
      console.log(data);
      console.log(JSON.parse(data));
      console.log(JSON.parse(data)[0]);
      var value = JSON.parse(data)[0];
      value.timestamp = time;

      var opts = {
        app_id: APP_NAME,
        room_id: ROOM_NAME,
        channel: CHANNEL_NAME,
        value: value,
        create_room: true
      };

      client.channels.message(opts, function(err, value) {
        if (err) {
          return console.log(err);
        }

        console.log('sync', value);
      });
    });
  });
};
