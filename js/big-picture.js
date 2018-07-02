'use strict';
(function () {
  var COUNT_OF_COMMENTS_ONE_TIME = 5;
  var AvatarNumber = {
    MIN: 1,
    MAX: 6
  };

  var bigPicture = document.querySelector('.big-picture');
  var fragment = document.createDocumentFragment();
  var bigPictureCancel = document.querySelector('.big-picture__cancel');
  var loadMoreCommentsButton = document.querySelector('.social__loadmore');
  var commentsCountElement = document.querySelector('.social__comment-count');
  var pictures = document.querySelector('.pictures');
  var loadMoreCommentsButtonClickHandler;

  var renderComment = function (path, text) {
    var renderedComment = document.querySelector('#comment').content.querySelector('.social__comment').cloneNode(true);
    renderedComment.querySelector('img').src = path;
    renderedComment.querySelector('p').textContent = text;
    return renderedComment;
  };

  var generateAvatarPath = function () {
    return 'img/avatar-' + window.util.getRandomIntFromRange(AvatarNumber.MIN, AvatarNumber.MAX) + '.svg';
  };

  var getCountEndingFromCount = function (count) {
    var ending = count.toString().slice(-1) === '1' ? ' комментария' : ' комментариев';
    return ending;
  };

  var renderComments = function (comments, listedCommentsCount, newCommentsCount) {
    for (var i = listedCommentsCount; i < newCommentsCount; i++) {
      fragment.appendChild(renderComment(generateAvatarPath(), comments[i]));
    }
    commentsCountElement.childNodes[0].textContent = newCommentsCount + ' из ';
    bigPicture.querySelector('.social__comments').appendChild(fragment);
  };

  var addLoadMoreCommentsButtonClickHandler = function (comments, listedCommentsCount) {
    loadMoreCommentsButtonClickHandler = function () {
      showCommentsAfterFirstTime(comments, listedCommentsCount);
    };
    loadMoreCommentsButton.addEventListener('click', loadMoreCommentsButtonClickHandler);
  };

  var noMoreCommentsButton = function () {
    loadMoreCommentsButton.classList.add('visually-hidden');
    loadMoreCommentsButton.removeEventListener('click', loadMoreCommentsButtonClickHandler);
  };

  var showCommentsFirstTime = function (comments) {
    if (comments.length > COUNT_OF_COMMENTS_ONE_TIME) {
      renderComments(comments, 0, COUNT_OF_COMMENTS_ONE_TIME);
      addLoadMoreCommentsButtonClickHandler(comments, COUNT_OF_COMMENTS_ONE_TIME);
    } else {
      loadMoreCommentsButton.classList.add('visually-hidden');
      renderComments(comments, 0, comments.length);
    }
  };

  var showCommentsAfterFirstTime = function (comments, listedCommentsCount) {
    var newCommentsCount = listedCommentsCount + COUNT_OF_COMMENTS_ONE_TIME;
    if (comments.length > newCommentsCount) {
      renderComments(comments, listedCommentsCount, newCommentsCount);
      loadMoreCommentsButton.removeEvent('click', loadMoreCommentsButtonClickHandler);
      addLoadMoreCommentsButtonClickHandler(comments, newCommentsCount);
    } else {
      noMoreCommentsButton();
      renderComments(comments, listedCommentsCount, comments.length);
    }
  };

  var renderBigPicture = function (post) {
    bigPicture.querySelector('.big-picture__img img').src = post.url;
    bigPicture.querySelector('.likes-count').textContent = post.likes;
    bigPicture.querySelector('.comments-count').textContent = post.comments.length;
    commentsCountElement.childNodes[2].textContent = getCountEndingFromCount(post.comments.length);
    bigPicture.querySelector('.social__comments').innerHTML = '';
    showCommentsFirstTime(post.comments);
    bigPicture.querySelector('.social__caption').textContent = post.description;
    bigPicture.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
  };

  var closeBigPicture = function () {
    document.querySelector('body').classList.remove('modal-open');
    bigPicture.classList.add('hidden');
    loadMoreCommentsButton.classList.remove('visually-hidden');
    loadMoreCommentsButton.removeEventListener('click', loadMoreCommentsButtonClickHandler);
  };

  var getPictureIdFromPreview = function (element) {
    return parseInt(element.id, 10);
  };

  var picturesHandler = function (evt) {
    var posts = window.data.posts;
    if (evt.target.classList.contains('picture__img')) {
      renderBigPicture(posts[getPictureIdFromPreview(evt.target)]);
      window.handlers.add(bigPictureCancel, closeBigPicture, true);
    }
  };

  window.handlers.add(pictures, picturesHandler, false);

})();
