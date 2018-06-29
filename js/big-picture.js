'use strict';
(function () {
  var ESC_KEYCODE = 27;

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

  var renderComments = function (comments) {
    var avatar;
    for (var i = 0; i < comments.length; i++) {
      avatar = 'img/avatar-' + window.util.getRandomIntFromRange(1, 6) + '.svg';
      fragment.appendChild(renderComment(avatar, comments[i]));
    }
    bigPicture.querySelector('.social__comments').appendChild(fragment);
  };

  var addLoadMoreCommentsButtonClickHandler = function (comments, listedCommentsCount) {
    loadMoreCommentsButtonClickHandler = function () {
      showComments(comments, listedCommentsCount);
    };
    loadMoreCommentsButton.addEventListener('click', loadMoreCommentsButtonClickHandler);
  };

  var noMoreComments = function () {
    loadMoreCommentsButton.classList.add('visually-hidden');
    loadMoreCommentsButton.removeEventListener('click', loadMoreCommentsButtonClickHandler);
  };

  var showComments = function (comments, listedCommentsCount) {
    if (listedCommentsCount === 0) {
      if (comments.length > listedCommentsCount + 5) {
        renderComments(comments.slice(listedCommentsCount, listedCommentsCount + 5));
        addLoadMoreCommentsButtonClickHandler(comments, listedCommentsCount + 5);
      } else if (comments.length > listedCommentsCount) {
        renderComments(comments.slice(listedCommentsCount, comments.length));
      }
    } else {
      if (comments.length > listedCommentsCount + 5) {
        renderComments(comments.slice(listedCommentsCount, listedCommentsCount + 5));
        loadMoreCommentsButton.removeEventListener('click', loadMoreCommentsButtonClickHandler);
        addLoadMoreCommentsButtonClickHandler(comments, listedCommentsCount + 5);
      } else if (comments.length > listedCommentsCount) {
        renderComments(comments.slice(listedCommentsCount, comments.length));
        noMoreComments();
      } else {
        noMoreComments();
      }
    }
  };

  var renderBigPicture = function (post) {
    bigPicture.querySelector('.big-picture__img img').src = post.url;
    bigPicture.querySelector('.likes-count').textContent = post.likes;
    bigPicture.querySelector('.comments-count').textContent = post.comments.length;
    bigPicture.querySelector('.social__comments').innerHTML = '';
    showComments(post.comments, 0);
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
    loadMoreCommentsButton.removeEventListener('click', loadMoreCommentsButtonClickHandler);
    bigPictureCancel.removeEventListener('click', bigPictureClose);
    document.removeEventListener('keydown', bigPictureCloseByEsc);
  };

  document.querySelector('.pictures').addEventListener('click', function (evt) {
    previewContainerClickHandler(evt, window.data.posts);
  });

})();
