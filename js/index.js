'use strict';
(function () {
  var POST_COUNT = 25;

  var keksogram = function () {
    var posts = window.data.generate(POST_COUNT);
    window.gallery.render(posts);
    window.bigPicture.addHandler(posts);
    window.uploadSetup.addHandler();
  };

  keksogram();
})();
