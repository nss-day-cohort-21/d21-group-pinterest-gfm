(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
angular.module('myApp', ['ngRoute']);

let isAuth = (authFactory, $location) => {
  return new Promise((resolve, reject) => {
    let user = authFactory.getUser();
    user ? resolve() : $location.url('/home');
  });
};

angular.module('myApp').config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '/partials/home.html'
    })
    .otherwise('/home');
});

angular.module('myApp').run(function($rootScope, $window) {
  $rootScope.currentUser = null;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $rootScope.currentUser = user.uid;
    } else {
      $rootScope.currentUser = null;
      $window.location.href = '#!/home';
    }
  });
});

},{}],2:[function(require,module,exports){
(function() {
  'use strict';

  var AuthCtrl = function($rootScope, $scope, $window, authFactory) {
      function logIn() {
        authFactory.loginWithGoogle()
            .then(result => {
                $location.path('#!/board-list');
                // $rootScope.currentUser = result.user.uid;
            })
      }
  };

  AuthCtrl.$inject = ['$rootScope', '$scope', '$window', 'authFactory'];
  angular.modules('myApp').controller('AuthCtrl', AuthCtrl);
})();

},{}],3:[function(require,module,exports){
(function() {
  'use strict';
  var authFactory = function($http) {
    return {
      loginWithGoogle: function() {
        let google = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(google);
      },
      getUser: function() {
          return $rootScope.currentUser;
      }
    };
  };

  authFactory.$inject = ['$http'];
  angular.module('myApp').factory('authFactory', authFactory);
})();

},{}]},{},[1,2,3]);
