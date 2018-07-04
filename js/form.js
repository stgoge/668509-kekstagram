'use strict';
(function () {
  var ERROR_INPUT_BORDER = '2px solid red';
  var TagsCheckError = {
    HASH_FIRST: 'Теги должны начинаться с #!',
    MIN_LENGTH: 'В теге должен быть хотя бы один символ кроме #!',
    TAG_MAX_LENGTH: 'В теге должно быть не более 20 символов включая #!',
    SEPARATOR: 'Теги нужно разделять пробелами!',
    UNIQUE: 'Теги должны быть уникальными!',
    TAG_MAX_COUNT: 'Не более 5 тегов!'
  };

  var tagsElement = document.querySelector('.text__hashtags');
  var imageUploadFormElement = document.querySelector('#upload-select-image');
  var imageUploadSectionElement = document.querySelector('.img-upload__form');
  var imageUploadOverlayElement = document.querySelector('.img-upload__overlay');
  var imageUploadInputElement = document.querySelector('#upload-file');


  var successHandler = function () {
    window.uploadSetup.close();
  };

  var anotherFileClickHandler = function () {
    window.uploadSetup.reset();
    document.querySelector('.img-upload__message--error').classList.add('hidden');
    imageUploadInputElement.click();
  };

  var retryClickHandler = function () {
    window.backend.save(new FormData(imageUploadFormElement), successHandler, errorHandler);
  };


  var errorHandler = function (error) {
    var errorElement = document.querySelector('.img-upload__message--error');
    if (!errorElement) {
      errorElement = document.querySelector('#picture').content.querySelector('.img-upload__message--error').cloneNode(true);
      imageUploadSectionElement.appendChild(errorElement);
    }
    errorElement.childNodes[0].textContent = error;
    errorElement.classList.remove('hidden');
    imageUploadOverlayElement.classList.add('hidden');
    document.querySelector('#retry-request').addEventListener('click', retryClickHandler);
    document.querySelector('#upload-another-file').addEventListener('click', anotherFileClickHandler);
  };

  var imageUploadFormSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(imageUploadFormElement), successHandler, errorHandler);
  };

  var addImageUploadFormSubmitHandler = function () {
    imageUploadFormElement.addEventListener('submit', imageUploadFormSubmitHandler);
  };

  var removeImageUploadFormSubmitHandler = function () {
    imageUploadFormElement.removeEventListener('submit', imageUploadFormSubmitHandler);
  };

  var tagsElementInputHandler = function (evt) {
    var message = checkTagsValidity(evt);
    tagsElement.setCustomValidity(message);
    if (message) {
      tagsElement.style.border = ERROR_INPUT_BORDER;
    }
  };

  var addTagsElementInputHandler = function () {
    tagsElement.addEventListener('input', tagsElementInputHandler);
  };

  var removeTagsElementInputHandler = function () {
    tagsElement.removeEventListener('input', tagsElementInputHandler);
  };

  var checkTagsValidity = function (evt) {
    var tags = evt.target.value.split(' ');
    for (var i = 0; i < tags.length; i++) {
      if ((tags[i].charAt(0) !== '#') || (tags[i] === '')) {
        return TagsCheckError.HASH_FIRST;
      }
      if (tags[i].length < 2) {
        return TagsCheckError.MIN_LENGTH;
      }
      if (tags[i].length > 20) {
        return TagsCheckError.TAG_MAX_LENGTH;
      }
      if (tags[i].indexOf('#', 1) > 1) {
        return TagsCheckError.SEPARATOR;
      }
      for (var j = i + 1; j < tags.length; j++) {
        if (tags[i].toLowerCase() === tags[j].toLowerCase()) {
          return TagsCheckError.UNIQUE;
        }
      }
    }
    if (tags.length > 5) {
      return TagsCheckError.TAG_MAX_COUNT;
    }
    tagsElement.style.border = '';
    return '';
  };

  window.form = {
    addTagsHandler: addTagsElementInputHandler,
    removeTagsHandler: removeTagsElementInputHandler,
    addSubmitHandler: addImageUploadFormSubmitHandler,
    removeSubmitHandler: removeImageUploadFormSubmitHandler
  };
})();
