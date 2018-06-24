'use strict';
(function () {
  var fragment = document.createDocumentFragment();
  var bigPicture = document.querySelector('.big-picture');

  var renderPostInGallery = function (post) {
    var renderedPost = document.querySelector('#picture').content.querySelector('.picture__link').cloneNode(true);
    renderedPost.querySelector('.picture__img').src = post.url;
    renderedPost.querySelector('.picture__img').id = post.id;
    renderedPost.querySelector('.picture__stat--likes').textContent = post.likes;
    renderedPost.querySelector('.picture__stat--comments').textContent = post.comments.length;
    return renderedPost;
  };

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

  var renderGallery = function (posts) {
    var previewPage = document.querySelector('.pictures');
    for (var i = 0; i < posts.length; i++) {
      fragment.appendChild(renderPostInGallery(posts[i]));
    }
    previewPage.appendChild(fragment);
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

  window.render = {
    renderBigPicture: renderBigPicture,
    closeBigPicture: closeBigPicture,
    renderGallery: renderGallery
  };
})();
