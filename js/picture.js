'use strict';
var IMG_RESIZE_PROPERTY = {
  minScale: 25,
  maxScale: 100,
  step: 25
};
var ESC_KEYCODE = 27;
var DEFAULT_SCALE_VALUE = 20;
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
    filterStringBegins: 'grayscale(',
    filterStringEnds: ')'},
  'effect-sepia': {
    cssStyle: 'effects__preview--sepia',
    minScaleValue: 0,
    maxScaleValue: 1,
    filterStringBegins: 'sepia(',
    filterStringEnds: ')'},
  'effect-marvin': {
    cssStyle: 'effects__preview--marvin',
    minScaleValue: 0,
    maxScaleValue: 100,
    filterStringBegins: 'invert(',
    filterStringEnds: '%)'},
  'effect-phobos': {
    cssStyle: 'effects__preview--phobos',
    minScaleValue: 0,
    maxScaleValue: 3,
    filterStringBegins: 'blur(',
    filterStringEnds: 'px)'},
  'effect-heat': {
    cssStyle: 'effects__preview--heat',
    minScaleValue: 1,
    maxScaleValue: 3,
    filterStringBegins: 'brightness(',
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
    descriptions: getRandomListElement(DESCRIPTIONS),
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

var getBigPictureElement = function () {
  return document.querySelector('.big-picture');
};

var getBigPictureCancelElement = function () {
  return document.querySelector('.big-picture__cancel');
};

var renderBigPicture = function (post) {
  var bigPicture = getBigPictureElement();
  bigPicture.querySelector('.big-picture__img img').src = post.url;
  bigPicture.querySelector('.likes-count').textContent = post.likes;
  bigPicture.querySelector('.comments-count').textContent = post.comments.length;
  bigPicture.querySelector('.social__comments').innerHTML = '';
  bigPicture.querySelector('.social__comments').appendChild(renderComments(post));
  bigPicture.querySelector('.social__caption').textContent = post.descriptions;
  bigPicture.classList.remove('hidden');
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__loadmore').classList.add('visually-hidden');
};

var bigPictureCloseByEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    bigPictureClose();
  }
};

var bigPictureClose = function () {
  getBigPictureElement().classList.add('hidden');
  getBigPictureCancelElement().removeEventListener('click', bigPictureClose);
  document.removeEventListener('keydown', bigPictureCloseByEsc);
};

var getPictureIdFromPreview = function (evt) {
  return (parseInt(evt.target.id, 10) - 1);
};

var previewContainerClickHandler = function (evt, posts) {
  if (evt.target.classList.contains('picture__img')) {
    renderBigPicture(posts[getPictureIdFromPreview(evt)]);
    getBigPictureCancelElement().addEventListener('click', bigPictureClose);
    document.addEventListener('keydown', bigPictureCloseByEsc);
  }
};

var showPictures = function () {
  var posts = generatePosts(POST_COUNT);
  renderPreviewPage(posts);
  previewContainer.addEventListener('click', function (evt) {
    previewContainerClickHandler(evt, posts);
  });
};

var imageUploadInput = document.querySelector('#upload-file');
var imageUploadForm = document.querySelector('#upload-select-image');
var imageUploadFormSubmit = document.querySelector('#upload-submit');
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
var scaleValueElement = document.querySelector('.scale__value');
var previewContainer = document.querySelector('.pictures.container');
var currentStyle;
var currentScaleMouseUpHandler;

var calculateNewScale = function (number, isPlus) {
  var newNumber = (isPlus) ? Math.min(number + IMG_RESIZE_PROPERTY.step, IMG_RESIZE_PROPERTY.maxScale) : Math.max(number - IMG_RESIZE_PROPERTY.step, IMG_RESIZE_PROPERTY.minScale);
  return newNumber;
};

var increaseImgScale = function () {
  var newScale = calculateNewScale(parseInt(resizeControlInput.value, 10), true);
  imgUploadPreview.style.transform = 'scale(' + newScale / 100 + ')';
  resizeControlInput.value = newScale + '%';
};

var reduceImgScale = function () {
  var newScale = calculateNewScale(parseInt(resizeControlInput.value, 10), false);
  imgUploadPreview.style.transform = 'scale(' + newScale / 100 + ')';
  resizeControlInput.value = newScale + '%';
};

var getFilterNumericValue = function (min, max, part) {
  return (part * (max - min) + min);
};

var scalePinMouseDownHandler;

var resetImageStyles = function () {
  imgUploadPreview.classList.remove(currentStyle);
  scaleValueElement.value = DEFAULT_SCALE_VALUE;
  imgUploadPreview.style.filter = '';
};

var addScalePinMouseDownHandler = function (styleId) {
  scalePinMouseDownHandler = function (innerEvt) {
    var styleSet = IMAGE_STYLE_PROPERTY[styleId];
    innerEvt.preventDefault();
    currentScaleMouseUpHandler = function (deepEvt) {
      var filterNumericValue = getFilterNumericValue(styleSet.minScaleValue, styleSet.maxScaleValue, (deepEvt.target.offsetLeft / scaleLine.clientWidth));
      scaleValueElement.value = filterNumericValue;
      imgUploadPreview.style.filter = styleSet.filterStringBegins + filterNumericValue + styleSet.filterStringEnds;
      document.removeEventListener('mouseup', currentScaleMouseUpHandler);
    };
    document.addEventListener('mouseup', currentScaleMouseUpHandler);
  };
  scalePin.addEventListener('mousedown', scalePinMouseDownHandler);
};

var changePictureEffect = function (evt) {
  if (scalePinMouseDownHandler) {
    scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);
  }
  resetImageStyles();
  applyImageStyle(evt.target.id);
  addScalePinMouseDownHandler(evt.target.id);
};

var applyImageStyle = function (styleId) {
  if (styleId === 'effect-none') {
    scaleLineField.classList.add('hidden');
    return;
  }
  scaleLineField.classList.remove('hidden');
  currentStyle = IMAGE_STYLE_PROPERTY[styleId].cssStyle;
  imgUploadPreview.classList.add(currentStyle);
};

var validateTags = function (tags) {
  var tagsInList = tags.split(' ');
  if (tagsInList.length > 5) {
    return 'Не более 5 тегов!';
  }
  for (var i = 0; i < tagsInList.length; i++) {
    if (tagsInList[i].charAt(0) !== '#') {
      return 'Теги должны начинаться с #!';
    } else if (tagsInList[i].length < 2) {
      return 'В теге должен быть хотя бы один символ кроме #!';
    } else if (tagsInList[i].length > 20) {
      return 'В теге должно быть не более 20 символов включая #!';
    } else if (tagsInList[i].indexOf('#', 1) > 1) {
      return 'Теги нужно разделять пробелами!';
    } else {
      for (var j = i + 1; j < tagsInList.length; j++) {
        if (tagsInList[i].toLowerCase() === tagsInList[i].toLowerCase()) {
          return 'Теги должны быть уникальными!';
        }
      }
    }
  }
  return '';
};

var imageUploadFormSubmitClickHandler = function (evt) {
  evt.preventDefault();
  var tagsElement = imageUploadForm.querySelector('.text__hashtags');
  var imageDescription = imageUploadForm.querySelector('.text__description').value;
  var tagsErrorText = validateTags(tagsElement.value);
  if (tagsErrorText) {
    tagsElement.setCustomValidity(tagsErrorText); // вот тут
  }
};

var openImgOverlay = function () {
  var checkedStyleId = document.querySelector('input[name="effect"]:checked').id;
  applyImageStyle(checkedStyleId);
  addScalePinMouseDownHandler(checkedStyleId);
  imgOverlay.classList.remove('hidden');
  document.addEventListener('keydown', closeSetupByEsc);
  imgUploadCancel.addEventListener('click', closeImgOverlay);
  resizeControlMinus.addEventListener('click', reduceImgScale);
  resizeControlPlus.addEventListener('click', increaseImgScale);
  effectsList.addEventListener('change', changePictureEffect);
  imageUploadFormSubmit.addEventListener('click', imageUploadFormSubmitClickHandler);
};

var closeImgOverlay = function () {
  resetImageStyles();
  imgOverlay.classList.add('hidden');
  imageUploadInput.value = '';
  document.removeEventListener('keydown', closeSetupByEsc);
  imgUploadCancel.removeEventListener('click', closeImgOverlay);
  resizeControlMinus.removeEventListener('click', reduceImgScale);
  resizeControlPlus.removeEventListener('click', increaseImgScale);
  effectsList.removeEventListener('change', changePictureEffect);
  scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);
};

var closeSetupByEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeImgOverlay();
  }
};

imageUploadInput.addEventListener('change', function () {
  openImgOverlay();
});

showPictures();
