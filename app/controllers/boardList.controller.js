(function() {
  'use strict';

  var BoardListCtrl = function($scope, $http, firebaseFactory) {
    $scope.getAllBoards = getAllBoards;
    $scope.boards = [];

    function getAllBoards() {
      let user = firebase.auth().currentUser.uid;
      firebaseFactory.getAllPins(user).then(result => {
        console.log('Boards: ', result);
        $scope.boards = result;
      });
    }
    getAllBoards();
  };

  BoardListCtrl.$inject = ['$scope', '$http', 'firebaseFactory'];
  angular.module('myApp').controller('BoardListCtrl', BoardListCtrl);
})();
