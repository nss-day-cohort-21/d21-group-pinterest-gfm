(function() {
  'use strict';

  var AuthCtrl = function($rootScope, $scope, $location, $window, authFactory) {
    $scope.logIn = logIn;
    $scope.logOut = logOut;

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
  };

  AuthCtrl.$inject = ['$rootScope', '$scope', '$location', '$window', 'authFactory'];
  angular.module('myApp').controller('AuthCtrl', AuthCtrl);
})();
