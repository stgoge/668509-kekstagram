'use strict';
(function () {
  var DEFAULT_SCALE_VALUE = 20;
  var DEFAULT_IMAGE_SIZE = 100;
  var ImageResizeProperty = {
    MIN_SIZE: 25,
    MAX_SIZE: 100,
    STEP: 25
  };
  var ImageStyleProperty = {
    'effect-chrome': {
      CSS_STYLE: 'effects__preview--chrome',
      MIN_FILTER_VALUE: 0,
      MAX_FILTER_VALUE: 1,
      FILTER_STRING_BEGINS: 'grayscale(',
      FILTER_STRING_ENDS: ')'},
    'effect-sepia': {
      CSS_STYLE: 'effects__preview--sepia',
      MIN_FILTER_VALUE: 0,
      MAX_FILTER_VALUE: 1,
      FILTER_STRING_BEGINS: 'sepia(',
      FILTER_STRING_ENDS: ')'},
    'effect-marvin': {
      CSS_STYLE: 'effects__preview--marvin',
      MIN_FILTER_VALUE: 0,
      MAX_FILTER_VALUE: 100,
      FILTER_STRING_BEGINS: 'invert(',
      FILTER_STRING_ENDS: '%)'},
    'effect-phobos': {
      CSS_STYLE: 'effects__preview--phobos',
      MIN_FILTER_VALUE: 0,
      MAX_FILTER_VALUE: 3,
      FILTER_STRING_BEGINS: 'blur(',
      FILTER_STRING_ENDS: 'px)'},
    'effect-heat': {
      CSS_STYLE: 'effects__preview--heat',
      MIN_FILTER_VALUE: 1,
      MAX_FILTER_VALUE: 3,
      FILTER_STRING_BEGINS: 'brightness(',
      FILTER_STRING_ENDS: ')'}
  };

  var postWindow = document.querySelector('.img-upload__overlay');
  var imagePreview = postWindow.querySelector('.img-upload__preview');
  var imgUploadCancel = document.querySelector('.img-upload__cancel');

  var imageUploadInputElement = document.querySelector('#upload-file');
  var tagsInputElement = postWindow.querySelector('.text__hashtags');
  var descriptionInputElement = postWindow.querySelector('.text__description');

  var effectsListElement = postWindow.querySelector('.effects__list');

  var resizeInputElement = postWindow.querySelector('.resize__control--value');
  var resizeControlPlusElement = postWindow.querySelector('.resize__control--plus');
  var resizeControlMinusElement = postWindow.querySelector('.resize__control--minus');

  var scaleLineFieldSetElement = document.querySelector('.img-upload__scale');
  var scaleLineElement = scaleLineFieldSetElement.querySelector('.scale__line');
  var scalePinElement = scaleLineFieldSetElement.querySelector('.scale__pin');
  var scaleInputElement = scaleLineFieldSetElement.querySelector('input[name="effect-level"]');

  var getPartOfRange = function (min, max, part) {
    return (part * (max - min) / 100 + min);
  };

  var calculateNewImageSize = function (size, factor) {
    return Math.max(ImageResizeProperty.MIN_SIZE, Math.min(size + ImageResizeProperty.STEP * factor, ImageResizeProperty.MAX_SIZE));
  };

  var applyImageSize = function (size) {
    imagePreview.style.transform = 'scale(' + size / 100 + ')';
    resizeInputElement.value = size + '%';
  };

  var transformImageSize = function (factor) {
    var newSize = calculateNewImageSize(parseInt(resizeInputElement.value, 10), factor);
    applyImageSize(newSize);
  };

  var resetScale = function () {
    scaleInputElement.value = DEFAULT_SCALE_VALUE;
    imagePreview.style.filter = '';
  };

  var resetImageStyle = function () {
    imagePreview.classList.remove(getCheckedStyleInputId());
    resetScale();
  };

  var renderScalePin = function (scaleValue) {
    var maxValue = scaleLineElement.clientWidth;
    var pinWidth = scalePinElement.clientWidth;
    var lineFillWidth = scaleValue - (pinWidth / (2 * maxValue) * 100);
    scalePinElement.style.left = scaleValue + '%';
    scaleLineFieldSetElement.querySelector('.scale__level').style.width = lineFillWidth + '%';
  };

  var generateFilterString = function (scalePercentValue, styleName) {
    var style = ImageStyleProperty[styleName];
    var numericFilterValue = getPartOfRange(style.MIN_FILTER_VALUE, style.MAX_FILTER_VALUE, scalePercentValue);
    return style.FILTER_STRING_BEGINS + numericFilterValue + style.FILTER_STRING_ENDS;
  };

  var applyFilter = function (scalePercentValue, styleName) {
    imagePreview.style.filter = generateFilterString(scalePercentValue, styleName);
  };

  var applyScaleInputValue = function (scalePercentValue) {
    scaleInputElement.value = Math.round(scalePercentValue);
  };

  var applyScaleChange = function (scalePercentValue) {
    var styleName = getCheckedStyleInputId();
    renderScalePin(scalePercentValue);
    applyFilter(scalePercentValue, styleName);
    applyScaleInputValue(scalePercentValue);
  };

  var applyImageStyle = function () {
    var styleName = getCheckedStyleInputId();
    if (styleName === 'effect-none') {
      scaleLineFieldSetElement.classList.add('hidden');
      return;
    }
    scaleLineFieldSetElement.classList.remove('hidden');
    imagePreview.classList.add(styleName);
    applyScaleChange(DEFAULT_SCALE_VALUE);
  };

  var resetPreviewPageToDefaults = function () {
    resetImageStyle();
    postWindow.classList.add('hidden');
    applyImageSize(DEFAULT_IMAGE_SIZE);
    imageUploadInputElement.value = '';
    tagsInputElement.value = '';
    descriptionInputElement.value = '';
  };

  var getCheckedStyleInputId = function () {
    return document.querySelector('input[name="effect"]:checked').id;
  };

  var initiatePreviewStyles = function () {
    postWindow.classList.remove('hidden');
    applyImageStyle();
  };

  var changeFilter = function () {
    window.slider.remove();
    resetImageStyle();
    applyImageStyle();
    window.slider.init(scaleLineElement, scalePinElement, applyScaleChange);
  };

  var resizeControlMinusClickHandler = function () {
    transformImageSize(-1);
  };

  var resizeControlPlusClickHandler = function () {
    transformImageSize(1);
  };

  var openImageOverlay = function () {
    initiatePreviewStyles();
    window.slider.init(scaleLineElement, scalePinElement, applyScaleChange);
    window.handlers.add(imgUploadCancel, closeImageOverlay, true);
    resizeControlMinusElement.addEventListener('click', resizeControlMinusClickHandler);
    resizeControlPlusElement.addEventListener('click', resizeControlPlusClickHandler);
    effectsListElement.addEventListener('change', changeFilter);
    document.querySelector('body').classList.add('modal-open');
    window.form.addTagsHandler();
    window.form.addSubmitHandler();
  };

  var closeImageOverlay = function () {
    resetPreviewPageToDefaults();
    resizeControlMinusElement.removeEventListener('click', resizeControlMinusClickHandler);
    resizeControlPlusElement.removeEventListener('click', resizeControlPlusClickHandler);
    effectsListElement.removeEventListener('change', changeFilter);
    document.querySelector('body').classList.remove('modal-open');
    window.slider.remove();
    window.form.removeTagsHandler();
    window.form.removeSubmitHandler();
  };

  imageUploadInputElement.addEventListener('change', function () {
    openImageOverlay();
  });

  window.uploadSetup = {
    close: closeImageOverlay,
    reset: resetPreviewPageToDefaults
  };
})();
