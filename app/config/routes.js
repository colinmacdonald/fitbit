/*jshint node:true */

'use strict';

var routes = exports;
exports.constructor = function routes() {};

var site = require('../controllers/site');
var auth = require('../middleware/auth');
var fitbitAPI = require('../controllers/fitbit_api');

routes.configure = function(app, passport) {
  //app.all('*', forceSSL.force);

  app.get('/', site.index);

  app.post('/notifications/fitbit', fitbitAPI.notifications);

  app.get('/auth/fitbit', passport.authenticate('fitbit'));

  app.get('/auth/fitbit/callback',
    passport.authenticate('fitbit', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    }
  );

  app.post('/auth/forcedotcom', passport.authenticate('forcedotcom'));

  app.get('/auth/forcedotcom/callback',
    passport.authenticate('forcedotcom', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    }
  );
};
