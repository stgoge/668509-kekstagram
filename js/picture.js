'use strict';
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];
var POSTS_NEEDED = 25;
var IMG_PROPERTIES = {
  path: 'photos/',
  extension: '.jpg'
};
var COMMENTS_ON_PAGE = 2;
var NUMBER_OF_POST_FOR_BIG_PICTURE = 0;
var LIKES_PROPERTIES = {
  max: 200,
  min: 15
};
var getRandomArrayElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};
var generatePost = function (count) {
  var post = {
    comments: []
  };
  post.url = IMG_PROPERTIES.path + count + IMG_PROPERTIES.extension;
  post.likes = Math.max(Math.round((Math.random() * LIKES_PROPERTIES.max), LIKES_PROPERTIES.min));
  post.comments.push(getRandomArrayElement(COMMENTS));
  if (Math.round(Math.random())) {
    post.comments.push(getRandomArrayElement(COMMENTS));
  }
  post.description = getRandomArrayElement(DESCRIPTION);
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
var renderPreviewPage = function (posts) {
  var previewPage = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < POSTS_NEEDED; i++) {
    fragment.appendChild(renderPostPreview(posts[i]));
  }
  previewPage.appendChild(fragment);
};
var showBigPicture = function (post) {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClone = bigPicture.cloneNode(true);
  bigPictureClone.classList.remove('hidden');
  bigPictureClone.querySelector('.big-picture__img img').src = post.url;
  bigPictureClone.querySelector('.likes-count').textContent = post.likes;
  bigPictureClone.querySelector('.comments-count').textContent = post.comments.length;
  var comments = bigPictureClone.querySelectorAll('.social__comment');
  for (var i = 0; i < COMMENTS_ON_PAGE; i++) {
    if (post.comments[i]) {
      comments[i].querySelector('.social__picture').src = 'img/avatar-' + Math.ceil(Math.random() * 5) + '.svg';
      comments[i].querySelector('.social__text').textContent = post.comments[i];
    } else {
      comments[i].classList.add('visually-hidden');
    }
  }
  bigPictureClone.querySelector('.social__caption').textContent = post.description;
  bigPicture.parentNode.replaceChild(bigPictureClone, bigPicture);
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__loadmore').classList.add('visually-hidden');
};
var showPictures = function () {
  var posts = generatePosts(POSTS_NEEDED);
  renderPreviewPage(posts);
  showBigPicture(posts[NUMBER_OF_POST_FOR_BIG_PICTURE]);
};
showPictures();
