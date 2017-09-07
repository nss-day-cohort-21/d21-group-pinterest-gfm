'use strict';


let UserSearch = function($scope, $window, RedditFactory, firebaseFactory) {
    let userId; 
    if (firebase.auth().currentUser !== null) {
        userId = firebase.auth().currentUser.uid;
    }

    $('.grid').masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 200
    });


    $($window).scroll(function () {
        let scrollTop = $($window).scrollTop();
        let windowHeight = $($window).height();
        let docHeight = $(document).height();
        let totalWindow = scrollTop + windowHeight + 500;
        console.log("totalwindow", totalWindow);
        console.log("docheight", docHeight);
        if ( totalWindow >= docHeight-100 && totalWindow <= docHeight) {
            console.log("hello");
            RedditFactory.getScrollSearch()
                .then((data) => {
                    console.log("data.children", data);
                    let card = {};
                    data.forEach((item, index) => {
                        // erp = eachRedditPost
                        let erp = item.data;

                        if (erp.preview && erp.preview.images[0].variants.hasOwnProperty('gif')) {
                            // console.log("indexGif", index);
                            card[index] = {
                                author: erp.author,
                                score: (Number(erp.score) / 1000).toFixed(1),
                                title: erp.title,
                                url: erp.preview.images[0].variants.gif.source.url,
                                category: erp.subreddit
                            };
                        } else if (erp.preview && erp.preview.images[0].hasOwnProperty('variants')) {
                            // console.log("indexImg", index);
                            card[index] = {
                                author: erp.author,
                                score: (Number(erp.score) / 1000).toFixed(1),
                                title: erp.title,
                                url: erp.preview.images[0].source.url,
                                category: erp.subreddit
                            };
                        } else {
                            // console.log("indexNoImg", index);
                            card[index] = {
                                author: erp.author,
                                score: (Number(erp.score) / 1000).toFixed(1),
                                title: erp.title,
                                url: `${erp.url}.jpg`,
                                category: erp.subreddit
                            };
                        }

                    });
                    $scope.redditSearch1 = card;
                });
        }
    });

    $('#loginModal').modal('show');

    //$scope.search used when user hits search button the input value is passed into getUserSearch function from the RedditFactory which returns data.data.data.children. Then a card for each post is passed into a larger card object which will be used in a ng-repeat to create cards
    $scope.search = function(search) {
        RedditFactory.getUserSearch(search)
        .then((data) => {
            console.log("data.children", data);
            let card = {};
            data.forEach((item, index) => {
                // erp = eachRedditPost
                let erp = item.data;

                if (erp.preview && erp.preview.images[0].variants.hasOwnProperty('gif')) {
                    // console.log("indexGif", index);
                    card[index] = {
                        author: erp.author,
                        score: (Number(erp.score)/1000).toFixed(1),
                        title: erp.title,
                        url: erp.preview.images[0].variants.gif.source.url,
                        category: erp.subreddit
                    };
                } else if (erp.preview && erp.preview.images[0].hasOwnProperty('variants')) {
                    // console.log("indexImg", index);
                    card[index] = {
                        author: erp.author,
                        score: (Number(erp.score)/1000).toFixed(1),
                        title: erp.title,
                        url: erp.preview.images[0].source.url,
                        category: erp.subreddit
                    };
                } else {
                    // console.log("indexNoImg", index);
                    card[index] = {
                        author: erp.author,
                        score: (Number(erp.score)/1000).toFixed(1),
                        title: erp.title,
                        url: `${erp.url}.jpg`,
                        category: erp.subreddit
                    };
                }
                
            });
            $scope.redditSearch = card;
        });
    };

    $scope.getModalURL = function(id, post) {
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

    $scope.paginationFunction = function() {
        console.log("hi");
    };

    $scope.landingSearch = function () {
        RedditFactory.landingSearch()
            .then((data) => {
                console.log("data.children", data);
                let card = {};
                data.forEach((item, index) => {
                    // erp = eachRedditPost
                    let erp = item.data;

                    if (erp.preview && erp.preview.images[0].variants.hasOwnProperty('gif')) {
                        // console.log("indexGif", index);
                        card[index] = {
                            author: erp.author,
                            score: (Number(erp.score) / 1000).toFixed(1),
                            title: erp.title,
                            url: erp.preview.images[0].variants.gif.source.url,
                            category: erp.subreddit
                        };
                    } else if (erp.preview && erp.preview.images[0].hasOwnProperty('variants')) {
                        // console.log("indexImg", index);
                        card[index] = {
                            author: erp.author,
                            score: (Number(erp.score) / 1000).toFixed(1),
                            title: erp.title,
                            url: erp.preview.images[0].source.url,
                            category: erp.subreddit
                        };
                    } else {
                        // console.log("indexNoImg", index);
                        card[index] = {
                            author: erp.author,
                            score: (Number(erp.score) / 1000).toFixed(1),
                            title: erp.title,
                            url: `${erp.url}.jpg`,
                            category: erp.subreddit
                        };
                    }

                });
                $scope.redditSearch = card;
            });
    };

    $scope.closeModal = function() {
        $('#pinModal').modal('hide');
    };

    $scope.landingSearch();
    // $scope.postBoard({title: "Macaroni"});
};

angular.module('myApp').controller('UserSearch', UserSearch);