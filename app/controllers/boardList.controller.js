(function() {
  'use strict';

  var BoardListCtrl = function($scope, $http, $routeParams, $location, firebaseFactory,$route) {

    $scope.getAllBoards = getAllBoards;
    $scope.getSingleBoard = getSingleBoard;
    $scope.deleteBoard = deleteBoard;
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
      let myItem=[];
      let itemDeleting=[];
      firebaseFactory.getAllPinsByBoard(key).then((item)=>{
        myItem.push(item);
        myItem.forEach((item)=>{
          itemDeleting.push(item);
          let myUglyId = Object.keys(itemDeleting[0]);
          myUglyId.forEach((item)=>{
            console.log("what is each item", item);
            firebaseFactory.deleteThisBoard(item);

      // $(".board-row").html(' ');

          });

        });
      });
      $location.url("/user-search/");
    }

    getAllBoards();
  };

  BoardListCtrl.$inject = ['$scope', '$http', '$routeParams', '$location', 'firebaseFactory',"$route"];
  angular.module('myApp').controller('BoardListCtrl', BoardListCtrl);
})();
