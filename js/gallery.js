'use strict';
(function () {
  var fragment = document.createDocumentFragment();

  var renderPostInGallery = function (post) {
    var renderedPost = document.querySelector('#picture').content.querySelector('.picture__link').cloneNode(true);
    renderedPost.querySelector('.picture__img').src = post.url;
    renderedPost.querySelector('.picture__img').id = post.id;
    renderedPost.querySelector('.picture__stat--likes').textContent = post.likes;
    renderedPost.querySelector('.picture__stat--comments').textContent = post.comments.length;
    return renderedPost;
  };
  var renderGallery = function (posts) {
    var previewPage = document.querySelector('.pictures');
    for (var i = 0; i < posts.length; i++) {
      fragment.appendChild(renderPostInGallery(posts[i]));
    }
    previewPage.appendChild(fragment);
  };

  renderGallery(window.data.posts);

})();
