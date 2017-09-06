(function() {
  'use strict';

  var AuthCtrl = function($rootScope, $scope, $location, $window, authFactory) {
    $scope.logIn = logIn;
    $scope.logOut = logOut;
    $scope.getUser = getUser;

    function logIn() {
      authFactory.loginWithGoogle().then(result => {
        $location.url('/board-list');
        $scope.$apply();
        // $rootScope.currentUser = result.user.uid;
      });
    }
    function logOut() {
      authFactory.logout().then(result => {
        $location.url('/home');
      });
    }
    function getUser(){
      return authFactory.getUser();
    }
  };

  AuthCtrl.$inject = ['$rootScope', '$scope', '$location', '$window', 'authFactory'];
  angular.module('myApp').controller('AuthCtrl', AuthCtrl);
})();
