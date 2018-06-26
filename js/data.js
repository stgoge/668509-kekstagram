'use strict';
(function () {
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var DESCRIPTIONS = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];
  var IMG_PROPERTY = {
    path: 'photos/',
    extension: '.jpg'
  };
  var COMMENTS_PROPERTY = {
    min: 1,
    max: 3
  };
  var LIKES_PROPERTY = {
    min: 15,
    max: 200
  };
  var POST_COUNT = 25;

  var getRandomIntFromRange = function (min, max) {
    return (Math.round((Math.random() * (max - min))) + min);
  };

  var getPictureUrl = function (number) {
    return IMG_PROPERTY.path + number + IMG_PROPERTY.extension;
  };

  var generatePost = function (count) {
    var post = {
      url: getPictureUrl(count),
      likes: getRandomIntFromRange(LIKES_PROPERTY.min, LIKES_PROPERTY.max),
      description: window.util.getRandomListElement(DESCRIPTIONS),
      comments: [],
      id: count + '__preview'};
    var commentsCount = getRandomIntFromRange(COMMENTS_PROPERTY.min, COMMENTS_PROPERTY.max);
    for (var i = 0; i < commentsCount; i++) {
      post.comments.push(window.util.getRandomListElement(COMMENTS));
    }
    return post;
  };

  var generatePosts = function (count) {
    var posts = [];
    for (var i = 1; i <= count; i++) {
      posts.push(generatePost(i));
    }
    return posts;
  };

  var posts = generatePosts(POST_COUNT);

  window.data = {
    posts: posts
  };
})();
