/*jshint node:true */

'use strict';

var fitbit = exports;
exports.constructor = function() {};

var fs = require('fs');
var multiparty = require('multiparty');
var goinstantClient = require('../lib/goinstant_client');
var fitbitClient = require('../lib/fitbit_client');

var ACTIVITY_KEY = 'activityData/';

fitbit.notifications = function(req, res) {
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

      var value = JSON.parse(data)[0];
      value.timestamp = time;

      fitbitClient.getCategoryData(
        value.ownerId,
        value.collectionType,
        value.date
      ).then(function(result) {
          goinstantClient.set(
            ACTIVITY_KEY + value.date + '/' + value.ownerId,
            result
          );
        });

      goinstantClient.notifySync(value);
    });
  });
};
