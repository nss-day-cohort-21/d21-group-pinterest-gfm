(function() {
  'use strict';

  var BoardListCtrl = function($scope, $http, $routeParams, $location, firebaseFactory) {

    $scope.getAllBoards = getAllBoards;
    $scope.getSingleBoard = getSingleBoard;
    $scope.boards = [];

    function getAllBoards() {
      let user = firebase.auth().currentUser.uid;
      firebaseFactory.getAllPins(user).then(result => {
        console.log('Boards: ', result);
        $scope.boards = result;
      });
    }

    function getSingleBoard (key) {
      firebaseFactory.setBoardId(key);
      $routeParams.boardId = key;
      console.log("what is routeparams", $routeParams.boardTitle);
      $location.url("/board-list/" + $routeParams.boardTitle);
    }
    function deleteBoard (key) {
      console.log('what is key',key);
      firebaseFactory.deleteBoard(key);
      $location.url("/board-list/");
      $scope.$apply();
    }

    getAllBoards();
  };

  BoardListCtrl.$inject = ['$scope', '$http', '$routeParams', '$location', 'firebaseFactory'];
  angular.module('myApp').controller('BoardListCtrl', BoardListCtrl);
})();
