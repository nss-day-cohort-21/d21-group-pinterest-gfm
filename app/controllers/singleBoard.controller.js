"use strict";
angular.module('myApp').controller("SingleBoardCtrl", function($scope,$route,$location, firebaseFactory, firebaseInfo,$routeParams){
  let userId;

  if (firebase.auth().currentUser !== null) {
    userId = firebase.auth().currentUser.uid;
  }
$scope.closeModal = function() {
        $('#exampleModal').modal('hide');
    };
const getPinOfBoard = function() {
  let boardId = firebaseFactory.getBoardId();

  firebaseFactory.getPinOfBoard(boardId).then((item)=>{
    $scope.pins=item.data;
  });
};

  $scope.deletePin = function(id){
    $(".progress").css("visibility","visible");
    firebaseFactory.deletePin(id)
    .then((data) => {
      $route.reload();
    });
  };

  $scope.getModalURL = function (id, post) {
    console.log("postpostpostpost", post);
    let imgURL = $(`#pin${id}`).attr('data-modalUrl');
    $('.modalImg').attr('src', imgURL);
    $('.modal-body').attr('data-post-title', post.title);
    // $('.modalTitle').text(post.title);
    $('.modal-card-text').text(post.title);
    $('.modal-thumb-tack').text(` ${post.score}k`);
    $('.modal-cardAuthor').text(`Author: ${post.author}`);
    $('.modal-body').attr('data-post-score', post.score);
    $('.modal-body').attr('data-post-author', post.author);

  };

  $scope.getAllBoards = function () {
    firebaseFactory.getAllBoards(userId).then((item) => {
      let board = item.data;
      let keys = Object.keys(board);
      keys.forEach((kitem, kindex) => {
        let eachBoard = board[kitem];
        eachBoard.ugly = keys[kindex];
      });
      $scope.board = board;
    });
  };

  $scope.postPin = function (key) {
    let post = {};
    post.boardid = $(`#modalPin${key}`).attr('data-ugly-id');
    post.uid = userId;
    post.title = $('.modal-body').attr('data-post-title');
    post.url = $('.modalImg').attr('src');
    post.score = $('.modal-body').attr('data-post-score');
    post.author = $('.modal-body').attr('data-post-author');
    post.boardTitle = $(`#board${key}`).text();
    console.log("post", post);
    firebaseFactory.postPin(post).then((item) => {
      console.log("what board is this dammit", item);
    });
  };

  $scope.postBoard = function (input) {
    let board = {};
    board.title = input;
    board.uid = userId;
    console.log("input", input);
    firebaseFactory.postBoard(board)
      .then((item) => {
        console.log("what board ", item);
        let post = {};
        post.boardid = item.data.name;
        post.uid = userId;
        post.title = $('.modal-body').attr('data-post-title');
        post.url = $('.modalImg').attr('src');
        post.score = $('.modal-body').attr('data-post-score');
        post.author = $('.modal-body').attr('data-post-author');
        post.boardTitle = input;
        console.log("post", post);
        firebaseFactory.postPin(post)
          .then((item) => {
            console.log("what board is this dammit", item);
          });
      });
  };

  // $scope.showEditNote = function(key){

  //   $(".progress").css("visibility","visible");
  //   $location.url("/notes/"+$routeParams.notetask+"/edit");


  // };
  getPinOfBoard();


  // $scope.showPins();
});
