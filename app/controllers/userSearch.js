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
        // console.log("totalwindow", totalWindow);
        // console.log("docheight", docHeight);
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

    //$scope.search used when user hits search button the input value is passed into getUserSearch function from the RedditFactory which returns data.data.data.children. Then a card for each item is passed into a larger card object which will be used in a ng-repeat to create cards
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
    $scope.addmore = function(e,search) {
      search = $('input').val();
      let item1;
      let item2;
      console.log("what is e",$(e.currentTarget).parent().parent().parent().next(),search);

      let mycurrentcard = $(e.currentTarget).parent().parent().parent();
      RedditFactory.getRelated(search).then((item)=>{
       let randomNum= Math.floor(Math.random() *24+1);
       let randomNum2 = Math.floor(Math.random() *24+1);
        item1 = item[randomNum].data;
        item2 = item[randomNum2].data;
        console.log("what is the returned item", item1,item2);
let nextcard = `
    <div class="outsideCard">
        <div class="card searchCard">
            <div class="imgBackground">
                <img class="card-img-top" src="${item1.preview.images[0].source.url}" alt="Card image cap">
                <button id="pin${1}" data-modalUrl="${item1.url}" type="button" class="btn btn-danger on-hide pinSaveBtn" data-toggle="modal" data-target="#pinModal"
                    ng-click="getModalURL(key, item); getAllBoards(item)"><i class="fa fa-thumb-tack" aria-hidden="true"></i></button>
                <button id="more${1}" data-modalUrl="${item1.url}" type="button" class="btn btn-danger more on-hide" ng-click="addmore($event,userSearch)">More</button>
            </div>
            <div class="card-block" ng-if="isLoggedIn">
                <div class="d-flex flex-row">
                    <h6 class="card-text p-2">${item1.title}</h6>
                    <i class="fa fa-thumb-tack pr-2 pt-2 pb-2 pl-1" aria-hidden="true"> ${item1.score}k</i>
                </div>
                <p class="cardAuthor">Author: ${item1.author}</p>
            </div>
        </div>
    </div>

      `;

      let previouscard = `
    <div class="outsideCard">
        <div class="card searchCard">
            <div class="imgBackground">
                <img class="card-img-top" src="${item2.preview.images[0].source.url}" alt="Card image cap">
                <button id="pin${1}" data-modalUrl="${item2.url}" type="button" class="btn btn-danger on-hide pinSaveBtn" data-toggle="modal" data-target="#pinModal"
                    ng-click="getModalURL(key, item); getAllBoards(item)"><i class="fa fa-thumb-tack" aria-hidden="true"></i></button>
                <button id="more${1}" data-modalUrl="${item2.url}" type="button" class="btn btn-danger more on-hide" ng-click="addmore($event,userSearch)">More</button>
            </div>
            <div class="card-block" ng-if="isLoggedIn">
                <div class="d-flex flex-row">
                    <h6 class="card-text p-2">${item2.title}</h6>
                    <i class="fa fa-thumb-tack pr-2 pt-2 pb-2 pl-1" aria-hidden="true"> ${item2.score}k</i>
                </div>
                <p class="cardAuthor">Author: ${item2.author}</p>
            </div>
        </div>
    </div>

      `;


      mycurrentcard.append(nextcard);
      mycurrentcard.prepend(previouscard);


      });
      // https://www.reddit.com/search?q=author%3APresidentObama&restrict_sr=&sort=relevance&t=all

      // let nextnextcard = $(e.currentTarget).parent().parent().parent().next().next();
    };

    $scope.landingSearch();
    // $scope.postBoard({title: "Macaroni"});
};

angular.module('myApp').controller('UserSearch', UserSearch);
