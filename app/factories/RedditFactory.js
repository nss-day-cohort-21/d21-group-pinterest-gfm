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
