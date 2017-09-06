(function() {
  'use strict';

  var AuthCtrl = function($rootScope, $scope, $location, $window, authFactory) {
    $scope.logIn = logIn;
    $scope.logOut = logOut;
    $scope.getUser = getUser;


    function logIn() {
      authFactory.loginWithGoogle().then(result => {
        let user = result.user.uid;
        if (user) {
          $location.url('/board-list');
          $scope.$apply();
          $rootScope.currentUser = result.user.uid;
          $rootScope.isLoggedIn = true;
        } else {
          $rootScope.isLoggedIn = false;
        }
      });
    }
    function logOut() {
      authFactory.logout().then(result => {
        let user = firebase.auth().currentUser;
        if (user) {
          $location.url('/board-list');
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
