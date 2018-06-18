'use strict';
var ESC_KEYCODE = 27;
var DEFAULT_SCALE_VALUE = 20;
var IMG_RESIZE_PROPERTY = {
  minScale: 25,
  maxScale: 100,
  step: 25
};
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
var POST_COUNT = 25;
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

var IMAGE_STYLE_PROPERTY = {
  'effect-chrome': {
    cssStyle: 'effects__preview--chrome',
    minScaleValue: 0,
    maxScaleValue: 1,
    filterStringBigins: 'grayscale(',
    filterStringEnds: ')'},
  'effect-sepia': {
    cssStyle: 'effects__preview--sepia',
    minScaleValue: 0,
    maxScaleValue: 1,
    filterStringBigins: 'sepia(',
    filterStringEnds: ')'},
  'effect-marvin': {
    cssStyle: 'effects__preview--marvin',
    minScaleValue: 0,
    maxScaleValue: 100,
    filterStringBigins: 'invert(',
    filterStringEnds: '%)'},
  'effect-phobos': {
    cssStyle: 'effects__preview--phobos',
    minScaleValue: 0,
    maxScaleValue: 3,
    filterStringBigins: 'blur(',
    filterStringEnds: 'px)'},
  'effect-heat': {
    cssStyle: 'effects__preview--heat',
    minScaleValue: 1,
    maxScaleValue: 3,
    filterStringBigins: 'brightness(',
    filterStringEnds: ')'}
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
    url: getPictureUrl(count),
    likes: getRandomIntFromRange(LIKES_PROPERTY.min, LIKES_PROPERTY.max),
    DESCRIPTIONS: getRandomListElement(DESCRIPTIONS),
    comments: [],
    id: count + '__preview'};
  var commentsCount = getRandomIntFromRange(COMMENTS_PROPERTY.min, COMMENTS_PROPERTY.max);
  for (var i = 0; i < commentsCount; i++) {
    post.comments.push(getRandomListElement(COMMENTS));
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

var renderPostPreview = function (post) {
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
  var comments = document.createDocumentFragment();
  var commentUrl;
  for (var i = 0; i < post.comments.length; i++) {
    commentUrl = 'img/avatar-' + getRandomIntFromRange(1, 6) + '.svg';
    comments.appendChild(renderComment(commentUrl, post.comments[i]));
  }
  return comments;
};

var renderPreviewPage = function (posts) {
  var previewPage = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < POST_COUNT; i++) {
    fragment.appendChild(renderPostPreview(posts[i]));
  }
  previewPage.appendChild(fragment);
};
var bigPicture;
var bigPictureCancel;

var renderBigPicture = function (post) {
  bigPicture = document.querySelector('.big-picture');
  var bigPictureClone = bigPicture.cloneNode(true);
  bigPictureClone.classList.remove('hidden');
  bigPictureClone.querySelector('.big-picture__img img').src = post.url;
  bigPictureClone.querySelector('.likes-count').textContent = post.likes;
  bigPictureClone.querySelector('.comments-count').textContent = post.comments.length;
  bigPictureClone.querySelector('.social__comments').innerHTML = '';
  bigPictureClone.querySelector('.social__comments').appendChild(renderComments(post));
  bigPictureClone.querySelector('.social__caption').textContent = post.DESCRIPTIONS;
  bigPicture.parentNode.replaceChild(bigPictureClone, bigPicture);
  bigPicture = document.querySelector('.big-picture');
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__loadmore').classList.add('visually-hidden');
};

var bigPictureCloseByEsc = function (eve) {
  if (eve.keyCode === ESC_KEYCODE) {
    bigPictureClose();
  }

};

var bigPictureClose = function () {
  bigPicture.classList.add('hidden');
  bigPictureCancel.removeEventListener('click', bigPictureClose);
  bigPictureCancel.removeEventListener('keydown', bigPictureCloseByEsc);

};

var documentClickHandler = function (eve, posts) {
  if (eve.target.classList.value === 'picture__img') {
    renderBigPicture(posts[parseInt(eve.target.id, 10) - 1]);
    bigPictureCancel = document.querySelector('.big-picture__cancel');
    bigPictureCancel.addEventListener('click', bigPictureClose);
    document.addEventListener('keydown', bigPictureCloseByEsc);

  }
};

var showPictures = function () {
  var posts = generatePosts(POST_COUNT);
  renderPreviewPage(posts);
  document.addEventListener('click', function (eve) {
    documentClickHandler(eve, posts);
  });
};
showPictures();


var uploadForm = document.querySelector('#upload-file');
var imgOverlay = document.querySelector('.img-upload__overlay');
var imgUploadCancel = document.querySelector('.img-upload__cancel');
var resizeControlPlus = document.querySelector('.resize__control--plus');
var resizeControlMinus = document.querySelector('.resize__control--minus');
var resizeControlInput = document.querySelector('.resize__control--value');
var imgUploadPreview = document.querySelector('.img-upload__preview');
var effectsList = document.querySelector('.effects__list');
var scaleLineField = document.querySelector('.img-upload__scale');
var scaleLine = document.querySelector('.scale__line');
var scalePin = document.querySelector('.scale__pin');
var scaleValue = document.querySelector('.scale__value');
var currentStyle;
var currentScaleHandler;

var calculateNewNumber = function (number, change, min, max) {
  var newNumber = number;
  if (number + change <= max && number + change >= min) {
    newNumber = number + change;
  }
  return newNumber;
};

var increaseImgScale = function () {
  var newScale = calculateNewNumber(parseInt(resizeControlInput.value, 10), IMG_RESIZE_PROPERTY.step, IMG_RESIZE_PROPERTY.minScale, IMG_RESIZE_PROPERTY.maxScale);
  imgUploadPreview.style.transform = 'scale(' + newScale / 100 + ')';
  resizeControlInput.value = newScale + '%';
};

var reduceImgScale = function () {
  var newScale = calculateNewNumber(parseInt(resizeControlInput.value, 10), -(IMG_RESIZE_PROPERTY.step), IMG_RESIZE_PROPERTY.minScale, IMG_RESIZE_PROPERTY.maxScale);
  imgUploadPreview.style.transform = 'scale(' + newScale / 100 + ')';
  resizeControlInput.value = newScale + '%';
};

var getPartOfScale = function (min, max, part) {
  return part * (max - min) + min;
};

var changePictureEffect = function (evt) {
  if (currentScaleHandler) {
    scaleLine.removeEventListener('mouseup', currentScaleHandler);
    imgUploadPreview.classList.remove(currentStyle);
    scaleValue = DEFAULT_SCALE_VALUE;
  }
  if (evt.target.id === 'effect-none') {
    scaleLineField.classList.add('hidden');
    return;
  }
  var styleSet = IMAGE_STYLE_PROPERTY[evt.target.id];
  currentStyle = styleSet.cssStyle;
  scaleLineField.classList.remove('hidden');
  imgUploadPreview.style.filter = '';
  imgUploadPreview.classList.add(currentStyle);
  currentScaleHandler = function (deepEvt) {
    var numberForScale = getPartOfScale(styleSet.minScaleValue, styleSet.maxScaleValue, deepEvt.target.offsetLeft / scaleLine.clientWidth);
    scaleValue.value = numberForScale;
    imgUploadPreview.style.filter = styleSet.filterStringBigins + numberForScale + styleSet.filterStringEnds;
  };
  scalePin.addEventListener('mouseup', currentScaleHandler);
};

var openImgOverlay = function () {
  scaleLineField.classList.add('hidden');
  imgOverlay.classList.remove('hidden');
  document.addEventListener('keydown', closeSetupByEsc);
  imgUploadCancel.addEventListener('click', closeImgOverlay);
  resizeControlMinus.addEventListener('click', reduceImgScale);
  resizeControlPlus.addEventListener('click', increaseImgScale);
  effectsList.addEventListener('change', changePictureEffect);
};

var closeImgOverlay = function () {
  imgOverlay.classList.add('hidden');
  uploadForm.value = '';
  document.removeEventListener('keydown', closeSetupByEsc);
  imgUploadCancel.removeEventListener('click', closeImgOverlay);
  resizeControlMinus.removeEventListener('click', reduceImgScale);
  resizeControlPlus.removeEventListener('click', increaseImgScale);
  effectsList.removeEventListener('change', changePictureEffect);
  scaleLine.removeEventListener('mouseup', currentScaleHandler);
};

var closeSetupByEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeImgOverlay();
  }
};

uploadForm.addEventListener('change', function () {
  openImgOverlay();
});

