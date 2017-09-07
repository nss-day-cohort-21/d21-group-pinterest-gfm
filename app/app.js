'use strict';
angular.module('myApp', ['ngRoute', 'angular.filter']);


angular.module('myApp').config(function($routeProvider) {

  let isAuth = (authFactory, $location) => {
    return new Promise((resolve, reject) => {
      let user = firebase.auth().currentUser;
      // let user = authFactory.getUser();
      return user ? resolve() : $location.url('/home');
    });
  };

  $routeProvider
    .when('/home', {
      templateUrl: '/partials/home.html'
    })
    .when('/board-list', {
        templateUrl: '/partials/board-list.html',
        controller: 'BoardListCtrl',
        resolve: {isAuth}
    })
    .when('/user-search', {
        templateUrl: '/partials/search-list.html',
        controller: 'UserSearch'
    })
    .when('/pin-list', {
        templateUrl: '/partials/pin-list.html',
        controller: 'PinsController'
    })
    .otherwise('/home');
});

angular.module('myApp').run(function($rootScope, $window, firebaseInfo) {
  $rootScope.isLoggedIn = false;
  firebase.initializeApp(firebaseInfo);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $rootScope.isLoggedIn = true;

    } else {
      $rootScope.isLoggedIn = false;
      $window.location.href = '#!/home';
    }
  });
});
