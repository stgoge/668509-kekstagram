'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var imageUploadInput = document.querySelector('#upload-file');
  var imgUploadCancel = document.querySelector('.img-upload__cancel');
  var resizeControlPlus = document.querySelector('.resize__control--plus');
  var resizeControlMinus = document.querySelector('.resize__control--minus');
  var effectsList = document.querySelector('.effects__list');
  var scaleLine = document.querySelector('.scale__line');
  var scalePin = document.querySelector('.scale__pin');
  var imageUploadForm = document.querySelector('#upload-select-image');
  var tagsElement = imageUploadForm.querySelector('.text__hashtags');
  var description = document.querySelector('.text__description');
  var bigPictureCancel = document.querySelector('.big-picture__cancel');
  var scalePinMouseDownHandler;

  var bigPictureClose = function () {
    window.render.closeBigPicture();
    bigPictureCancel.removeEventListener('click', bigPictureClose);
    document.removeEventListener('keydown', bigPictureCloseByEsc);
  };

  var getPictureIdFromPreview = function (evt) {
    return (parseInt(evt.target.id, 10) - 1);
  };

  var previewContainerClickHandler = function (evt, posts) {
    if (evt.target.classList.contains('picture__img')) {
      window.render.renderBigPicture(posts[getPictureIdFromPreview(evt)]);
      bigPictureCancel.addEventListener('click', bigPictureClose);
      document.addEventListener('keydown', bigPictureCloseByEsc);
    }
  };

  var changeFilter = function () {
    scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);
    window.preview.resetImageStyle();
    window.preview.applyImageStyle(window.preview.getCheckedStyleInputId());
    addScalePinMouseDownHandler(window.preview.getCheckedStyleInputId());
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
          window.preview.applyScaleChange(scaleValue / maxValue * 100, styleId);
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

  var tagsElementInputHandler = function (evt) {
    tagsElement.setCustomValidity(window.checkForm.checkTagsValidity(evt));
  };

  var resizeControlMinusClickHandler = function () {
    window.preview.transformImageSize(-1);
  };

  var resizeControlPlusClickHandler = function () {
    window.preview.transformImageSize(1);
  };

  var openImageOverlay = function () {
    window.preview.initiatePreviewStyles();
    addScalePinMouseDownHandler(window.preview.getCheckedStyleInputId());
    document.addEventListener('keydown', closeSetupByEsc);
    imgUploadCancel.addEventListener('click', closeImageOverlay);
    resizeControlMinus.addEventListener('click', resizeControlMinusClickHandler);
    resizeControlPlus.addEventListener('click', resizeControlPlusClickHandler);
    effectsList.addEventListener('change', changeFilter);
    tagsElement.addEventListener('input', tagsElementInputHandler);
  };

  var closeImageOverlay = function () {
    window.preview.resetPreviewPageToDefaults();
    document.removeEventListener('keydown', closeSetupByEsc);
    imgUploadCancel.removeEventListener('click', closeImageOverlay);
    resizeControlMinus.removeEventListener('click', window.preview.reduceImgScale);
    resizeControlPlus.removeEventListener('click', window.preview.increaseImgScale);
    effectsList.removeEventListener('change', changeFilter);
    scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);
    tagsElement.removeEventListener('input', tagsElementInputHandler);
  };

  var checkEscExceptions = function (evt) {
    return (evt.target !== tagsElement && evt.target !== description);
  };

  var closeSetupByEsc = function (evt) {
    if (evt.keyCode === ESC_KEYCODE && checkEscExceptions(evt)) {
      closeImageOverlay();
    }
  };

  var bigPictureCloseByEsc = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      bigPictureClose();
    }
  };

  imageUploadInput.addEventListener('change', function () {
    openImageOverlay();
  });

  window.handlers = {
    previewContainerClickHandler: previewContainerClickHandler
  };

})();
