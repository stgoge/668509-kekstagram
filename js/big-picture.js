'use strict';
(function () {
  var bigPicture = document.querySelector('.big-picture');
  var fragment = document.createDocumentFragment();
  var bigPictureCancel = document.querySelector('.big-picture__cancel');
  var ESC_KEYCODE = 27;

  var renderComment = function (path, text) {
    var renderedComment = document.querySelector('#comment').content.querySelector('.social__comment').cloneNode(true);
    renderedComment.querySelector('img').src = path;
    renderedComment.querySelector('p').textContent = text;
    return renderedComment;
  };

  var renderComments = function (post) {
    var avatar;
    for (var i = 0; i < post.comments.length; i++) {
      avatar = 'img/avatar-' + window.util.getRandomIntFromRange(1, 6) + '.svg';
      fragment.appendChild(renderComment(avatar, post.comments[i]));
    }
    return fragment;
  };

  var renderBigPicture = function (post) {
    bigPicture.querySelector('.big-picture__img img').src = post.url;
    bigPicture.querySelector('.likes-count').textContent = post.likes;
    bigPicture.querySelector('.comments-count').textContent = post.comments.length;
    bigPicture.querySelector('.social__comments').innerHTML = '';
    bigPicture.querySelector('.social__comments').appendChild(renderComments(post));
    bigPicture.querySelector('.social__caption').textContent = post.description;
    bigPicture.classList.remove('hidden');
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__loadmore').classList.add('visually-hidden');
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
    bigPictureCancel.removeEventListener('click', bigPictureClose);
    document.removeEventListener('keydown', bigPictureCloseByEsc);
  };

  document.querySelector('.pictures').addEventListener('click', function (evt) {
    previewContainerClickHandler(evt, window.data.posts);
  });

})();
