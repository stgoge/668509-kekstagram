'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var SHOW_COMMENTS_ONE_TIME = 5;
  var AvatarNumber = {
    MIN: 1,
    MAX: 6
  };

  var bigPicture = document.querySelector('.big-picture');
  var fragment = document.createDocumentFragment();
  var bigPictureCancel = document.querySelector('.big-picture__cancel');
  var loadMoreCommentsButton = document.querySelector('.social__loadmore');
  var loadMoreCommentsButtonClickHandler;


  var renderComment = function (path, text) {
    var renderedComment = document.querySelector('#comment').content.querySelector('.social__comment').cloneNode(true);
    renderedComment.querySelector('img').src = path;
    renderedComment.querySelector('p').textContent = text;
    return renderedComment;
  };

  var generateAvatar = function () {
    return 'img/avatar-' + window.util.getRandomIntFromRange(AvatarNumber.MIN, AvatarNumber.MAX) + '.svg';
  };

  var renderComments = function (comments) {
    comments.forEach(function (comment) {
      fragment.appendChild(renderComment(generateAvatar(), comment));
    });
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

  var showCommentsFirstTime = function (comments, listedCommentsCount) {
    var newCommentsCount = listedCommentsCount + SHOW_COMMENTS_ONE_TIME;
    if (comments.length > newCommentsCount) {
      renderComments(comments.slice(listedCommentsCount, newCommentsCount));
      addLoadMoreCommentsButtonClickHandler(comments, newCommentsCount);
    } else if (comments.length > 0) {
      loadMoreCommentsButton.classList.add('visually-hidden');
      renderComments(comments.slice(listedCommentsCount, comments.length));
    }
  };

  var showCommentsAfterFirstTime = function (comments, listedCommentsCount) {
    var newCommentsCount = listedCommentsCount + SHOW_COMMENTS_ONE_TIME;
    if (comments.length > newCommentsCount) {
      renderComments(comments.slice(listedCommentsCount, newCommentsCount));
      loadMoreCommentsButton.removeEventListener('click', loadMoreCommentsButtonClickHandler);
      addLoadMoreCommentsButtonClickHandler(comments, newCommentsCount);
    } else {
      noMoreCommentsButton();
      if (comments.length > listedCommentsCount) {
        renderComments(comments.slice(listedCommentsCount, comments.length));
      }
    }
  };

  var renderBigPicture = function (post) {
    bigPicture.querySelector('.big-picture__img img').src = post.url;
    bigPicture.querySelector('.likes-count').textContent = post.likes;
    bigPicture.querySelector('.comments-count').textContent = post.comments.length;
    bigPicture.querySelector('.social__comments').innerHTML = '';
    showCommentsFirstTime(post.comments, 0);
    bigPicture.querySelector('.social__caption').textContent = post.description;
    bigPicture.classList.remove('hidden');
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
  };

  var bigPictureCloseByEsc = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      bigPictureClose();
    }
  };

  var getPictureIdFromPreview = function (evt) {
    return parseInt(evt.target.id, 10);
  };

  var previewContainerClickHandler = function (evt, posts) {
    if (evt.target.classList.contains('picture__img')) {
      renderBigPicture(posts[getPictureIdFromPreview(evt)]);
      bigPictureCancel.addEventListener('click', bigPictureClose);
      document.addEventListener('keydown', bigPictureCloseByEsc);
    }
  };

  var bigPictureClose = function () {
    closeBigPicture();
    loadMoreCommentsButton.classList.remove('visually-hidden');
    loadMoreCommentsButton.removeEventListener('click', loadMoreCommentsButtonClickHandler);
    bigPictureCancel.removeEventListener('click', bigPictureClose);
    document.removeEventListener('keydown', bigPictureCloseByEsc);
  };

  document.querySelector('.pictures').addEventListener('click', function (evt) {
    previewContainerClickHandler(evt, window.data.posts);
  });
})();
