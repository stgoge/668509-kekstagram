'use strict';
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
var PROPERTIES = {
  postCount: 25,
  img: {
    path: 'photos/',
    extension: '.jpg'
  },
  comment: {
    min: 3,
    max: 5
  },
  likes: {
    min: 15,
    max: 200
  }
};
var getRandomIntFromRange = function (min, max) {
  return (Math.round((Math.random() * (max - min))) + min);
};
var getRandomListElement = function (list) {
  return list[getRandomIntFromRange(0, list.length - 1)];
};
var getPictureUrl = function (number) {
  return PROPERTIES.img.path + number + PROPERTIES.img.extension;
};
var generatePost = function (count) {
  var post = {
    comments: []
  };
  post.url = getPictureUrl(count);
  post.likes = getRandomIntFromRange(PROPERTIES.likes.min, PROPERTIES.likes.max);
  var commentsCount = getRandomIntFromRange(PROPERTIES.comment.min, PROPERTIES.comment.max);
  for (var i = 0; i < commentsCount; i++) {
    post.comments.push(getRandomListElement(COMMENTS));
  }
  post.DESCRIPTIONS = getRandomListElement(DESCRIPTIONS);
  return post;
};
var generatePosts = function (count) {
  var posts = [];
  for (var i = 1; i <= count; i++) {
    posts.push(generatePost(i));
  }
  return posts;
};
var renderPostPreview = function (post) {
  var renderedPost = document.querySelector('#picture').content.querySelector('.picture__link').cloneNode(true);
  renderedPost.querySelector('.picture__img').src = post.url;
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
var renderPreviewPage = function (posts) {
  var previewPage = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < PROPERTIES.postCount; i++) {
    fragment.appendChild(renderPostPreview(posts[i]));
  }
  previewPage.appendChild(fragment);
};
var renderBigPicture = function (post) {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClone = bigPicture.cloneNode(true);
  bigPictureClone.classList.remove('hidden');
  bigPictureClone.querySelector('.big-picture__img img').src = post.url;
  bigPictureClone.querySelector('.likes-count').textContent = post.likes;
  bigPictureClone.querySelector('.comments-count').textContent = post.comments.length;
  var comments = document.createDocumentFragment();
  var commentUrl;
  for (var i = 0; i < post.comments.length; i++) {
    commentUrl = 'img/avatar-' + getRandomIntFromRange(1, 6) + '.svg';
    comments.appendChild(renderComment(commentUrl, post.comments[i]));
  }
  bigPictureClone.querySelector('.social__comments').appendChild(comments);
  bigPictureClone.querySelector('.social__caption').textContent = post.DESCRIPTIONS;
  bigPicture.parentNode.replaceChild(bigPictureClone, bigPicture);
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__loadmore').classList.add('visually-hidden');
};
var showPictures = function () {
  var posts = generatePosts(PROPERTIES.postCount);
  renderPreviewPage(posts);
  renderBigPicture(posts[0]);
};
showPictures();
