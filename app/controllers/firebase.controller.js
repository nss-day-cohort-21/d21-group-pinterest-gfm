"use strict";
angular.module('myApp').controller("firebaseCtrl", function($scope,$route,$location, firebaseFactory, firebaseInfo){
  let userId = firebase.auth().currentUser.uid;

  $scope.showNotes = function(){
    firebaseFactory.getAllPins(userId)
    .then((data) => {
      console.log("what is the data", data);
    });
  };

  // $scope.deleteNote = function(id){
  //   $(".progress").css("visibility","visible");
  //   NotesFactory.deleteNote(id)
  //   .then((data) => {
  //     $route.reload();
  //   });
  // };

  // $scope.showEditNote = function(key){
    
  //   $(".progress").css("visibility","visible");
  //   $location.url("/notes/"+$routeParams.notetask+"/edit");
 

  // };



  // $scope.showNotes();
});