(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
angular.module('myApp', ['ngRoute']);


angular.module('myApp').config(function($routeProvider) {

  let isAuth = (authFactory, $location) => {
    return new Promise((resolve, reject) => {
      let user = authFactory.getUser();
      return user ? resolve() : $location.url('/home');
    });
  };

  $routeProvider
    .when('/home', {
      templateUrl: '/partials/home.html'
    })
    .when('/board-list', {
        templateUrl: '/partials/board-list.html',
        controller: 'firebaseCtrl',
        resolve: {isAuth}
    })
    .otherwise('/home');
});

angular.module('myApp').run(function($rootScope, $window, firebaseInfo) {
  firebase.initializeApp(firebaseInfo);
  $rootScope.currentUser = null;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $rootScope.currentUser = user.uid;
    } else {
      $rootScope.currentUser = null;
      $window.location.href = '#!/home';
    }
  });
});

},{}],2:[function(require,module,exports){
(function() {
  'use strict';

  var AuthCtrl = function($rootScope, $scope, $location, $window, authFactory) {
    $scope.logIn = logIn;
    $scope.logOut = logOut;
    $scope.getUser = getUser;

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
    function getUser(){
      return authFactory.getUser();
    }
  };

  AuthCtrl.$inject = ['$rootScope', '$scope', '$location', '$window', 'authFactory'];
  angular.module('myApp').controller('AuthCtrl', AuthCtrl);
})();

},{}],3:[function(require,module,exports){
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



  $scope.showNotes();
});
},{}],4:[function(require,module,exports){
'use strict';


let UserSearch = function($scope, RedditFactory) {

    //$scope.search used when user hits search button the input value is passed into getUserSearch function from the RedditFactory which returns data.data.data.children. Then a card for each post is passed into a larger card object which will be used in a ng-repeat to create cards
    $scope.search = function(search) {
        RedditFactory.getUserSearch(search)
        .then((data) => {
            console.log("userSearchData", data);
            let card = {};
            data.forEach((item, index) => {
                console.log("postData", item.data);
                // erp = eachRedditPost
                let erp = item.data;

                if (erp.preview && erp.preview.images[0].variants.hasOwnProperty('gif')) {
                    console.log("indexGif", index);
                    card[index] = {
                        title: erp.title,
                        url: erp.preview.images[0].variants.gif.source.url,
                        category: erp.subreddit
                    };
                } else if (erp.preview && erp.preview.images[0].hasOwnProperty('variants')) {
                    console.log("indexImg", index);
                    card[index] = {
                        title: erp.title,
                        url: erp.preview.images[0].source.url,
                        category: erp.subreddit
                    };
                } else {
                    console.log("indexNoImg", index);
                    card[index] = {
                        title: erp.title,
                        url: `${erp.url}.jpg`,
                        category: erp.subreddit
                    };
                }
                
            });
            console.log("card", card);
            $scope.redditSearch = card;
        });
    };
};

angular.module('myApp').controller('UserSearch', UserSearch);
},{}],5:[function(require,module,exports){
'use strict';

let RedditFactory = function($http) {
    let getUserSearch = function(userSearch) {
        // http://www.reddit.com/search.json?q=${userSearch}&sort=top
        // http://www.reddit.com/r/pics/search.json?q=${userSearch}&restrict_sr=on&sort=top
        return $http.get(`https://www.reddit.com/r/pics/search.json?q=${userSearch}&restrict_sr=on&sort=new&t=all`)
        .then((data) => {
            return data.data.data.children;
        })
        .catch((error) => {
            console.log("error", error);
        });
    };

    return { getUserSearch };

};




angular.module('myApp').factory('RedditFactory', RedditFactory);

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";
angular.module('myApp').factory("firebaseFactory", function($q, $http, firebaseInfo){
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
    const getAllBoards = (uid) =>{
        if (firebase.auth().currentUser) {
            let newnote = JSON.stringify(uid);
            return $q( (resolve, reject) => {
                $http.post(`${firebaseInfo.databaseURL}/boards.json?orderBy="uid"&equalTo="${uid}"`)
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
    return {getAllPins,getSinglePin,postPin,patchPin,deletePin,getAllBoards,getSingleBoard,postBoard,patchBoard,deleteBoard};
});
},{}],8:[function(require,module,exports){
angular.module('myApp').constant("firebaseInfo", {
    apiKey: "AIzaSyAUNFWpxXsVOGym0uhAO9TuRbXMytbMfz4",
    authDomain: "gfm-pinterest-ad24f.firebaseapp.com",
    databaseURL: "https://gfm-pinterest-ad24f.firebaseio.com",
    projectId: "gfm-pinterest-ad24f",
    storageBucket: "",
    messagingSenderId: "36699278937"
});
},{}]},{},[1,2,3,4,5,6,7,8]);
