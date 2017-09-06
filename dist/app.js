(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

angular.module('myApp', ['ngRoute']);
},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
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
                        url: erp.url,
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
},{}],4:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],5:[function(require,module,exports){
'use strict';

let RedditFactory = function($http) {
    let getUserSearch = function(userSearch) {
        // http://www.reddit.com/search.json?q=${userSearch}&sort=top
        // http://www.reddit.com/r/pics/search.json?q=${userSearch}&restrict_sr=on&sort=top
        return $http.get(`https://www.reddit.com/r/pics/search.json?q=${userSearch}&restrict_sr=on&sort=top&t=all`)
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

},{}]},{},[1,2,3,4,5]);
