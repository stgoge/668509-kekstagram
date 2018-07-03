'use strict';
(function () {
  var COUNT_OF_COMMENTS_ONE_TIME = 5;
  var AvatarNumber = {
    MIN: 1,
    MAX: 6
  };

  var fragment = document.createDocumentFragment();

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCancelElement = document.querySelector('.big-picture__cancel');
  var loadMoreCommentsElement = document.querySelector('.social__loadmore');
  var commentsCountElement = document.querySelector('.social__comment-count');
  var picturesElement = document.querySelector('.pictures');

  var loadMoreCommentsClickHandler;

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
    bigPictureElement.querySelector('.social__comments').appendChild(fragment);
  };

  var addLoadMoreCommentsButtonClickHandler = function (comments, listedCommentsCount) {
    loadMoreCommentsClickHandler = function () {
      showCommentsAfterFirstTime(comments, listedCommentsCount);
    };
    loadMoreCommentsElement.addEventListener('click', loadMoreCommentsClickHandler);
  };

  var noMoreCommentsButton = function () {
    loadMoreCommentsElement.classList.add('visually-hidden');
    loadMoreCommentsElement.removeEventListener('click', loadMoreCommentsClickHandler);
  };

  var showCommentsFirstTime = function (comments) {
    if (comments.length > COUNT_OF_COMMENTS_ONE_TIME) {
      renderComments(comments, 0, COUNT_OF_COMMENTS_ONE_TIME);
      addLoadMoreCommentsButtonClickHandler(comments, COUNT_OF_COMMENTS_ONE_TIME);
    } else {
      loadMoreCommentsElement.classList.add('visually-hidden');
      renderComments(comments, 0, comments.length);
    }
  };

  var showCommentsAfterFirstTime = function (comments, listedCommentsCount) {
    var newCommentsCount = listedCommentsCount + COUNT_OF_COMMENTS_ONE_TIME;
    if (comments.length > newCommentsCount) {
      renderComments(comments, listedCommentsCount, newCommentsCount);
      loadMoreCommentsElement.removeEvent('click', loadMoreCommentsClickHandler);
      addLoadMoreCommentsButtonClickHandler(comments, newCommentsCount);
    } else {
      noMoreCommentsButton();
      renderComments(comments, listedCommentsCount, comments.length);
    }
  };

  var renderBigPicture = function (post) {
    bigPictureElement.querySelector('.big-picture__img img').src = post.url;
    bigPictureElement.querySelector('.likes-count').textContent = post.likes;
    bigPictureElement.querySelector('.comments-count').textContent = post.comments.length;
    commentsCountElement.childNodes[2].textContent = getCountEndingFromCount(post.comments.length);
    bigPictureElement.querySelector('.social__comments').innerHTML = '';
    showCommentsFirstTime(post.comments);
    bigPictureElement.querySelector('.social__caption').textContent = post.description;
    bigPictureElement.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
  };

  var closeBigPicture = function () {
    document.querySelector('body').classList.remove('modal-open');
    bigPictureElement.classList.add('hidden');
    loadMoreCommentsElement.classList.remove('visually-hidden');
    loadMoreCommentsElement.removeEventListener('click', loadMoreCommentsClickHandler);
  };

  var getPictureIdFromElement = function (target) {
    while (target !== picturesElement) {
      if (target.classList.contains('picture__link')) {
        return parseInt(target.id, 10);
      }
      target = target.parentNode;
    }
    return '';
  };

  var picturesHandler = function (evt) {
    var id = getPictureIdFromElement(evt.target);
    if (id) {
      var posts = window.data.posts;
      renderBigPicture(posts[id]);
      window.handlers.add(bigPictureCancelElement, closeBigPicture, true);
    }
  };

  window.handlers.add(picturesElement, picturesHandler, false);
})();
