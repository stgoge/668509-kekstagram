'use strict';
(function () {
  var fragment = document.createDocumentFragment();

  var renderPostInGallery = function (post) {
    var renderedPost = document.querySelector('#picture').content.querySelector('.picture__link').cloneNode(true);
    renderedPost.querySelector('.picture__img').src = post.url;
    renderedPost.querySelector('.picture__stat--likes').textContent = post.likes;
    renderedPost.querySelector('.picture__stat--comments').textContent = post.comments.length;
    renderedPost.id = post.id;
    return renderedPost;
  };
  var renderGallery = function (posts) {
    var previewPage = document.querySelector('.pictures');
    posts.forEach(function (element) {
      fragment.appendChild(renderPostInGallery(element));
    });
    if (previewPage.hasChildNodes()) {
      previewPage.querySelectorAll('.picture__link').forEach(function (element) {
        previewPage.removeChild(element);
      });
    }
    previewPage.appendChild(fragment);
  };

  window.gallery = {
    render: renderGallery
  };
})();
