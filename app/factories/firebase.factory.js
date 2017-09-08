"use strict";
angular.module('myApp').factory("firebaseFactory", function($q, $http, firebaseInfo){


  let boardId;
  const setBoardId = function(id) {
    boardId = id;
  };
  const getBoardId = function() {
    return boardId;
  };
    const getAllPins = function(userId){
        let notes = [];
        return $q( (resolve, reject) => {
            $http.get(`${firebaseInfo.databaseURL}/pins.json?orderBy="uid"&equalTo="${userId}"`)
            .then((itemObject) => {
                notes = itemObject.data;
                resolve(notes);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    const getSinglePin = function(boardId){
        let notes = [];
        return $q( (resolve, reject) => {
            $http.get(`${firebaseInfo.databaseURL}/pins.json?orderBy="uid"&equalTo="${boardId}"`)
            .then((itemObject) => {
                notes = itemObject.data;
                resolve(notes);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    const postPin = (note) =>{
        if (firebase.auth().currentUser) {
            let newnote = JSON.stringify(note);
            return $q( (resolve, reject) => {
                $http.post(`${firebaseInfo.databaseURL}/pins.json`,newnote)
                .then((response) => {

                    resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    };
    const patchPin = function(id, obj) {
        return $q((resolve, reject) => {
            let newObj = JSON.stringify(obj);
            $http.patch(`${firebaseInfo.databaseURL}/pins/${id}.json`, newObj)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };
    const deletePin = function(uglyId){
        return $q( (resolve, reject) => {
            $http.delete(`${firebaseInfo.databaseURL}/pins/${uglyId}.json`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };
    const getAllBoards = (uid) => {
        if (firebase.auth().currentUser) {
            return $q((resolve, reject) => {
                $http.get(`${firebaseInfo.databaseURL}/boards.json?orderBy="uid"&equalTo="${uid}"`)
                    .then((response) => {

                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    };
    const getSingleBoard = (boardId) =>{
        if (firebase.auth().currentUser) {
            let newnote = JSON.stringify(boardId);
            return $q( (resolve, reject) => {
                $http.post(`${firebaseInfo.databaseURL}/boards/${boardId}.json`)
                .then((response) => {

                    resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    };
    const postBoard = (boardId) =>{
        if (firebase.auth().currentUser) {
            let newnote = JSON.stringify(boardId);
            return $q( (resolve, reject) => {
                $http.post(`${firebaseInfo.databaseURL}/boards/.json`,newnote)
                .then((response) => {

                    resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    };
    const patchBoard = function(id, obj) {
        return $q((resolve, reject) => {
            let newObj = JSON.stringify(obj);
            $http.patch(`${firebaseInfo.databaseURL}/boards/${id}.json`, newObj)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };
    const deleteBoard = function(uglyId){

        return $q( (resolve, reject) => {
            $http.delete(`${firebaseInfo.databaseURL}/boards/${uglyId}.json`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };


    const getPinOfBoard = (boardId) =>{
        if (firebase.auth().currentUser) {
            return $q( (resolve, reject) => {
                $http.get(`${firebaseInfo.databaseURL}//pins.json?orderBy="boardid"&equalTo="${boardId}"`)
                .then((response) => {
                    console.log("response", response);
                    resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    };
    return {getAllPins,getSinglePin,postPin,patchPin,deletePin,getAllBoards,getSingleBoard,postBoard,patchBoard,deleteBoard,getPinOfBoard,setBoardId,getBoardId};
});
