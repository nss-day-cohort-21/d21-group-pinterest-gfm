(function() {
  'use strict';
  var authFactory = function($http, $rootScope) {
    return {
      loginWithGoogle: function() {
        let google = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(google);
      },
      logout: function() {
        return firebase.auth().signOut();
      },
      getUser: function() {
        return $rootScope.currentUser;
      }
    };
  };

  authFactory.$inject = ['$http', '$rootScope'];
  angular.module('myApp').factory('authFactory', authFactory);
})();
