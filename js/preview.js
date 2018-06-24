'use strict';
(function () {
  var IMAGE_RESIZE_PROPERTY = {
    minSize: 25,
    maxSize: 100,
    step: 25
  };
  var IMAGE_STYLE_PROPERTY = {
    'effect-chrome': {
      cssStyle: 'effects__preview--chrome',
      minFilterValue: 0,
      maxFilterValue: 1,
      filterStringBegins: 'grayscale(',
      filterStringEnds: ')'},
    'effect-sepia': {
      cssStyle: 'effects__preview--sepia',
      minFilterValue: 0,
      maxFilterValue: 1,
      filterStringBegins: 'sepia(',
      filterStringEnds: ')'},
    'effect-marvin': {
      cssStyle: 'effects__preview--marvin',
      minFilterValue: 0,
      maxFilterValue: 100,
      filterStringBegins: 'invert(',
      filterStringEnds: '%)'},
    'effect-phobos': {
      cssStyle: 'effects__preview--phobos',
      minFilterValue: 0,
      maxFilterValue: 3,
      filterStringBegins: 'blur(',
      filterStringEnds: 'px)'},
    'effect-heat': {
      cssStyle: 'effects__preview--heat',
      minFilterValue: 1,
      maxFilterValue: 3,
      filterStringBegins: 'brightness(',
      filterStringEnds: ')'}
  };
  var DEFAULT_SCALE_VALUE = 20;
  var DEFAULT_IMAGE_SIZE = 100;

  var resizeInput = document.querySelector('.resize__control--value');
  var imagePreview = document.querySelector('.img-upload__preview');
  var uploadInput = document.querySelector('#upload-file');
  var postWindow = document.querySelector('.img-upload__overlay');
  var scaleLine = document.querySelector('.img-upload__scale');
  var scaleInput = document.querySelector('input[name="effect-level"]');
  var scaleLineFill = document.querySelector('.scale__level');
  var scalePin = document.querySelector('.scale__pin');
  var tags = document.querySelector('.text__hashtags');
  var description = document.querySelector('.text__description');
  var currentStyle;

  var calculateNewImageSize = function (size, factor) {
    return Math.max(IMAGE_RESIZE_PROPERTY.minSize, Math.min(size + IMAGE_RESIZE_PROPERTY.step * factor, IMAGE_RESIZE_PROPERTY.maxSize));
  };

  var applyImageSize = function (size) {
    imagePreview.style.transform = 'scale(' + size / 100 + ')';
    resizeInput.value = size + '%';
  };

  var transformImageSize = function (factor) {
    var newSize = calculateNewImageSize(parseInt(resizeInput.value, 10), factor);
    applyImageSize(newSize);
  };

  var resetScale = function () {
    scaleInput.value = DEFAULT_SCALE_VALUE;
    imagePreview.style.filter = '';
  };

  var resetImageStyle = function () {
    imagePreview.classList.remove(currentStyle);
    resetScale();
  };

  var renderScalePin = function (scaleValue) {
    scalePin.style.left = scaleValue + '%';
    scaleLineFill.style.width = scaleValue + '%';
  };

  var generateFilterString = function (scalePercentValue, styleName) {
    var style = IMAGE_STYLE_PROPERTY[styleName];
    var numericFilterValue = window.util.getPartOfRange(style.minFilterValue, style.maxFilterValue, scalePercentValue);
    return style.filterStringBegins + numericFilterValue + style.filterStringEnds;
  };

  var applyFilter = function (scalePercentValue, styleName) {
    imagePreview.style.filter = generateFilterString(scalePercentValue, styleName);
  };

  var applyScaleInputValue = function (scalePercentValue) {
    scaleInput.value = Math.round(scalePercentValue);
  };

  var applyScaleChange = function (scalePercentValue, styleName) {
    renderScalePin(scalePercentValue);
    applyFilter(scalePercentValue, styleName);
    applyScaleInputValue(scalePercentValue);
  };

  var applyImageStyle = function (styleName) {
    if (styleName === 'effect-none') {
      scaleLine.classList.add('hidden');
      return;
    }
    scaleLine.classList.remove('hidden');
    var style = IMAGE_STYLE_PROPERTY[styleName].cssStyle;
    currentStyle = style;
    imagePreview.classList.add(style);
    applyScaleChange(DEFAULT_SCALE_VALUE, styleName);
  };

  var resetPreviewPageToDefaults = function () {
    window.preview.resetImageStyle();
    postWindow.classList.add('hidden');
    applyImageSize(DEFAULT_IMAGE_SIZE);
    uploadInput.value = '';
    tags.value = '';
    description.value = '';
  };

  var getCheckedStyleInputId = function () {
    return document.querySelector('input[name="effect"]:checked').id;
  };

  var initiatePreviewStyles = function () {
    window.preview.applyImageStyle(getCheckedStyleInputId());
    postWindow.classList.remove('hidden');
  };

  window.preview = {
    applyImageStyle: applyImageStyle,
    resetImageStyle: resetImageStyle,
    transformImageSize: transformImageSize,
    applyScaleChange: applyScaleChange,
    resetPreviewPageToDefaults: resetPreviewPageToDefaults,
    initiatePreviewStyles: initiatePreviewStyles,
    getCheckedStyleInputId: getCheckedStyleInputId
  };
})();
