'use strict';
(function () {
  var POST_COUNT = 25;

  var keksogram = function () {
    var posts = window.data.generatePosts(POST_COUNT);
    window.render.renderGallery(posts);
    document.querySelector('.pictures.container').addEventListener('click', function (evt) {
      window.handlers.previewContainerClickHandler(evt, posts);
    });
  };

  keksogram();

})();
