'use strict';
angular.module('myApp', ['ngRoute']);

let isAuth = (authFactory, $location) => {
  return new Promise((resolve, reject) => {
    let user = authFactory.getUser();
    return user ? resolve() : $location.url('/home');
  });
};

angular.module('myApp').config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '/partials/home.html'
    })
    .when('/board-list', {
        templateUrl: '/partials/board-list.html',
        controller: 'firebaseCtrl'
    })
    .otherwise('/home');
});

angular.module('myApp').run(function($rootScope, $window,firebaseInfo) {
  firebase.initializeApp(firebaseInfo);
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
