/*jshint node:true */

'use strict';

var routes = exports;
exports.constructor = function routes() {};

var site = require('../controllers/site');
var auth = require('../middleware/auth');
var fitbit = require('../controllers/fitbit');

routes.configure = function(app, passport) {
  //app.all('*', forceSSL.force);

  app.post('/notifications/fitbit', fitbit.notifications);

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

  app.get('/auth/logout', site.logout);

  app.get('*', site.index);
};
