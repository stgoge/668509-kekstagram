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
var POSTS_COUNT = 25;
var IMG_PROPERTY = {
  path: 'photos/',
  extension: '.jpg'
};
var COMMENT_PROPERTY = {
  min: 4,
  max: 7
};
var LIKES_PROPERTY = {
  max: 200,
  min: 15
};
var getRandomIntFromRange = function (min, max) {
  return (Math.round((Math.random() * (max - min))) + min);
};
var getRandomListElement = function (list) {
  return list[getRandomIntFromRange(0, list.length - 1)];
};
var getPictureUrl = function (number) {
  return IMG_PROPERTY.path + number + IMG_PROPERTY.extension;
};
var generatePost = function (count) {
  var post = {
    comments: []
  };
  post.url = getPictureUrl(count);
  post.likes = getRandomIntFromRange(LIKES_PROPERTY.min, LIKES_PROPERTY.max);
  var commentsCount = getRandomIntFromRange(COMMENT_PROPERTY.min, COMMENT_PROPERTY.max);
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
var renderComment = function (avatar, text) {
  var renderedComment = document.querySelector('#comment').content.querySelector('.social__comment').cloneNode(true);
  renderedComment.querySelector('img').src = avatar;
  renderedComment.querySelector('p').textContent = text;
  return renderedComment;
};
var renderPreviewPage = function (posts) {
  var previewPage = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < POSTS_COUNT; i++) {
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
  var posts = generatePosts(POSTS_COUNT);
  renderPreviewPage(posts);
  renderBigPicture(posts[0]);
};
showPictures();
