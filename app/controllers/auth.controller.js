(function() {
  'use strict';

  var AuthCtrl = function($rootScope, $scope, $location, $window, authFactory) {
    $scope.logIn = logIn;
    $scope.logOut = logOut;
    $scope.getUser = getUser;

    var scrolldelay;
    function pageScroll() {
      window.scrollBy(0, 1);
      scrolldelay = setTimeout(pageScroll, 70);
    }
    if (firebase.auth().currentUser === null) {
      pageScroll();
    } else if (firebase.auth().currentUser !== null) {
      clearTimeout(scrolldelay);
    }

    function logIn() {
      authFactory.loginWithGoogle().then(result => {
        let user = result.user.uid;
        if (user) {
          $rootScope.isLoggedIn = true;
          clearTimeout(scrolldelay);
          $location.url('/user-search');
          $rootScope.currentUser = result.user.uid;
          $scope.$apply();
        } else {
          $rootScope.isLoggedIn = false;
        }
      });
    }
    function logOut() {
      authFactory.logout().then(result => {
        let user = firebase.auth().currentUser;
        if (user) {
          $location.url('/home');
          $scope.$apply();
          $rootScope.currentUser = result.user.uid;
          $rootScope.isLoggedIn = true;
        } else {
          $rootScope.isLoggedIn = false;
          $location.url('/home');
          $scope.$apply();
        }
      });
    }
    function getUser() {
      authFactory.getUser();
    }
  };

  AuthCtrl.$inject = ['$rootScope', '$scope', '$location', '$window', 'authFactory'];
  angular.module('myApp').controller('AuthCtrl', AuthCtrl);
})();
