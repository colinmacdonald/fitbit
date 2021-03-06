/*jshint browser: true */
/* global angular */

(function() {

'use strict';

var CHANNEL_NAME = 'fitbit/sync-notifications';
var TIMEOUT = 3000;

var app = angular.module('fitbit', ['ngRoute', 'goangular']);

app.config(function($routeProvider, $locationProvider, $goConnectionProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider
    .when('/', {
      templateUrl: 'templates/index.html',
      controller: 'indexCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'templates/dashboard.html',
      controller: 'dashboardCtrl',
      access: 'authenticated'
    })
    .when('/leaderboard', {
      templateUrl: 'templates/leaderboard.html',
      controller: 'leaderboardCtrl',
      access: 'authenticated'
    })
    .otherwise({
      redirectTo: '/'
    });

  var opts = {
    room: 'fitbit-lobby',
    user: window.jwt
  };

  $goConnectionProvider.$set(window.connectUrl, opts);
});

app.factory('permissions', function ($goConnection) {
  return {
    authorized: function(accessLevel) {
      var permission;

      switch ($goConnection.isGuest) {
        case true:
          permission = 'guest';
          break;
        case false:
          permission = 'authenticated';
          break;
        default:
          permission = null;
      }

      if (permission === accessLevel) {
        return true;
      }

      return false;
    }
 };
});

app.controller('mainCtrl',
  function($scope, $route, $location, $timeout, permissions, $goConnection, $goUsers) {
    $scope.conn = $goConnection;
    $scope.users = $goUsers();
    $scope.users.$self();

    $scope.ready = false;

    $goConnection.$ready().then(function() {
      $scope.$on('$routeChangeStart', routeAuthorized);

      function routeAuthorized(scope, next) {
        var route = next || $route.current;
        var accessLevel = route.access;

        if (accessLevel && !permissions.authorized(accessLevel)) {
          $location.path('/restricted');

          return false;
        }

        return true;
      }

      var access = routeAuthorized();

      if (access) {
        $scope.ready = true;
      } else {
        $scope.$on('$routeChangeSuccess', function() {
          $scope.ready = true;
        });
      }
    });

    $scope.notifications = {};

    $goConnection.$ready().then(function() {
      var room = $goUsers().$$key.room();
      window.room = room;

      var channel = room.channel(CHANNEL_NAME);
      channel.on('message', { local: true }, function(value) {
        var id = value.timestamp + value.ownerId;
        $timeout(function() {
          $scope.notifications[id] = value;

          $timeout(function() {
            delete $scope.notifications[id];
          }, TIMEOUT);
        });
      });
    });
  }
);

app.controller('indexCtrl', function($scope) {
  $scope.title = 'Index';
});

app.controller('dashboardCtrl', function($scope, $goKey) {
  $scope.title = 'Dashboard';
});

app.controller('leaderboardCtrl', function($scope, $goKey) {
  $scope.title = 'Leaderboard';

  $scope.date = '2014-05-23';

  $scope.userscache = $goKey('users');
  $scope.userscache.$sync();

  $scope.loadDate = function() {
    console.log('load');
    $scope.dailyData = $goKey('activityData/' + $scope.date);
    $scope.dailyData.$sync();
  };

  $scope.loadDate();

  $scope.orderByTerm = 'summary.steps';

  $scope.setOrder = function(term) {
    $scope.orderByTerm = '-summary.' + term;
  };
});

app.directive('access', function(permissions, $goConnection) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      function authenticate() {
        var accessLevel = attrs.access;

        if (accessLevel && !permissions.authorized(accessLevel)) {
          element.hide();

        } else {
          element.show();
        }
      }

      $goConnection.$ready().then(function() {
        authenticate();
      });
    }
  };
});

})();
