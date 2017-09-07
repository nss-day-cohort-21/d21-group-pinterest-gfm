'use strict';

let RedditFactory = function($http) {
    let after;
    let search;
    let getUserSearch = function(userSearch) {
        search = userSearch;
        // http://www.reddit.com/search.json?q=${userSearch}&sort=top
        // http://www.reddit.com/r/pics/search.json?q=${userSearch}&restrict_sr=on&sort=top
        return $http.get(`https://www.reddit.com/r/pics/search.json?q=${userSearch}&restrict_sr=on&sort=top&t=all`)
        .then((data) => {
            console.log("Reddit Data", data);
            after = data.data.data.after;
            console.log("after", after);
            console.log("search", search);
            return data.data.data.children;
        })
        .catch((error) => {
            console.log("error", error);
        });
    };

    let getScrollSearch = function() {
        console.log("after", after);
        console.log("search", search);
        return $http.get(`https://www.reddit.com/r/pics/search.json?q=${search}&restrict_sr=on&sort=top&t=all&count=25&after=${after}`)
            .then((data) => {
                console.log("data", data.data);
                after = data.data.data.after;
                return data.data.data.children;
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    let landingSearch = function() {
        return $http.get(`https://www.reddit.com/r/pics/top.json`)
            .then((data) => {
                console.log("data", data.data);
                after = data.data.data.after;
                return data.data.data.children;
            })
            .catch((error) => {
                console.log("error", error);
            });
    };



    return { getUserSearch, getScrollSearch, landingSearch };

};




angular.module('myApp').factory('RedditFactory', RedditFactory);
