'use strict';
(function () {
  var DESCRIPTIONS = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var generatePost = function (post) {
    var element = {
      url: post.url,
      likes: post.likes,
      description: window.util.getRandomListElement(DESCRIPTIONS),
      comments: post.comments,
      id: parseInt(post.url.match(/[0-9]+/), 10) - 1
    };
    return element;
  };

  var generatePosts = function (data) {
    var posts = [];
    data.forEach(function (element) {
      posts.push(generatePost(element));
    });
    window.filters.show();
    window.data = {
      posts: posts
    };
  };

  window.backend.load(generatePosts);

})();
