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