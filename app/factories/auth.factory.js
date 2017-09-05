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
