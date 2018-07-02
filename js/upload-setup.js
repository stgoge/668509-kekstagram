'use strict';
(function () {
  var IMAGE_RESIZE_PROPERTY = {
    minSize: 25,
    maxSize: 100,
    step: 25
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
  var DEFAULT_SCALE_VALUE = 20;
  var DEFAULT_IMAGE_SIZE = 100;

  var resizeInput = document.querySelector('.resize__control--value');
  var imagePreview = document.querySelector('.img-upload__preview');
  var postWindow = document.querySelector('.img-upload__overlay');
  var scaleLine = document.querySelector('.img-upload__scale');
  var scaleInput = document.querySelector('input[name="effect-level"]');
  var scaleLineFill = document.querySelector('.scale__level');
  var scalePin = document.querySelector('.scale__pin');
  var tags = document.querySelector('.text__hashtags');
  var description = document.querySelector('.text__description');
  var imageUploadInput = document.querySelector('#upload-file');
  var imgUploadCancel = document.querySelector('.img-upload__cancel');
  var resizeControlPlus = document.querySelector('.resize__control--plus');
  var resizeControlMinus = document.querySelector('.resize__control--minus');
  var effectsList = document.querySelector('.effects__list');
  var scalePinMouseDownHandler;
  var currentStyle;

  var getPartOfRange = function (min, max, part) {
    return (part * (max - min) / 100 + min);
  };

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
    var maxValue = scaleLine.clientWidth;
    var pinWidth = scalePin.clientWidth;
    var lineFillWidth = scaleValue - (pinWidth / (2 * maxValue) * 100);
    scalePin.style.left = scaleValue + '%';
    scaleLineFill.style.width = lineFillWidth + '%';
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
    var style = ImageStyleProperty[styleName].CSS_STYLE;
    currentStyle = style;
    imagePreview.classList.add(style);
    applyScaleChange(DEFAULT_SCALE_VALUE, styleName);
  };

  var resetPreviewPageToDefaults = function () {
    resetImageStyle();
    postWindow.classList.add('hidden');
    applyImageSize(DEFAULT_IMAGE_SIZE);
    imageUploadInput.value = '';
    tags.value = '';
    description.value = '';
  };

  var getCheckedStyleInputId = function () {
    return document.querySelector('input[name="effect"]:checked').id;
  };

  var initiatePreviewStyles = function () {
    postWindow.classList.remove('hidden');
    applyImageStyle(getCheckedStyleInputId());
  };

  var changeFilter = function () {
    scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);
    resetImageStyle();
    applyImageStyle(getCheckedStyleInputId());
    addScalePinMouseDownHandler(getCheckedStyleInputId());
  };

  var addScalePinMouseDownHandler = function (styleId) {
    var maxValue = scaleLine.clientWidth;
    var scaleValue = scalePin.offsetLeft;

    scalePinMouseDownHandler = function (innerEvt) {
      innerEvt.preventDefault();
      var startPinCoord = innerEvt.clientX;

      var scalePinMouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();
        var shift = moveEvt.clientX - startPinCoord;
        startPinCoord = moveEvt.clientX;
        var newValue = scaleValue + shift;
        if ((newValue <= maxValue) && (newValue >= 0)) {
          scaleValue = newValue;
          applyScaleChange(scaleValue / maxValue * 100, styleId);
        }
      };

      var currentScaleMouseUpHandler = function (mouseUpEvt) {
        mouseUpEvt.preventDefault();
        document.removeEventListener('mouseup', currentScaleMouseUpHandler);
        document.removeEventListener('mousemove', scalePinMouseMoveHandler);
      };

      document.addEventListener('mouseup', currentScaleMouseUpHandler);
      document.addEventListener('mousemove', scalePinMouseMoveHandler);
    };
    scalePin.addEventListener('mousedown', scalePinMouseDownHandler);
  };

  var resizeControlMinusClickHandler = function () {
    transformImageSize(-1);
  };

  var resizeControlPlusClickHandler = function () {
    transformImageSize(1);
  };

  var openImageOverlay = function () {
    var escHandlerNeeded = true;
    initiatePreviewStyles();
    addScalePinMouseDownHandler(getCheckedStyleInputId());
    window.handlers.add(imgUploadCancel, closeImageOverlay, escHandlerNeeded);
    resizeControlMinus.addEventListener('click', resizeControlMinusClickHandler);
    resizeControlPlus.addEventListener('click', resizeControlPlusClickHandler);
    effectsList.addEventListener('change', changeFilter);
    document.querySelector('body').classList.add('modal-open');
    window.form.addTagsHandler();
    window.form.addSubmitHandler();
  };

  var closeImageOverlay = function () {
    resetPreviewPageToDefaults();
    resizeControlMinus.removeEventListener('click', resizeControlMinusClickHandler);
    resizeControlPlus.removeEventListener('click', resizeControlPlusClickHandler);
    effectsList.removeEventListener('change', changeFilter);
    scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);
    document.querySelector('body').classList.remove('modal-open');
    window.form.removeTagsHandler();
    window.form.removeSubmitHandler();
  };

  imageUploadInput.addEventListener('change', function () {
    openImageOverlay();
  });

  window.uploadSetup = {
    close: closeImageOverlay,
    reset: resetPreviewPageToDefaults,
  };
})();
