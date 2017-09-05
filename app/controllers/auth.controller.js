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
