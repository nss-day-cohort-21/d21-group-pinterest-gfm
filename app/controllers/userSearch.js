'use strict';


let UserSearch = function($scope, RedditFactory, firebaseFactory) {
    let userId = firebase.auth().currentUser.uid;
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

    $scope.getModalURL = function(id, post) {
        console.log("post", post);
        let imgURL = $(`#pin${id}`).attr('data-modalUrl');
        $('.modalImg').attr('src', imgURL);
        $('.modal-body').attr('data-post-title', post.title);
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
        console.log("post", post);
        firebaseFactory.postPin(post).then((item) => {
            console.log("what board is this dammit", item);
        });
    };

    $scope.postBoard = function (board) {
        board.uid = userId;
        firebaseFactory.postBoard(board).then((item) => {
            console.log("what board ", item);
        });
    };

    // $scope.postBoard({title: "Macaroni"});
};

angular.module('myApp').controller('UserSearch', UserSearch);