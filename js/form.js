'use strict';
(function () {
  var tagsElement = document.querySelector('.text__hashtags');
  var imageUploadFormElement = document.querySelector('#upload-select-image');
  var imageUploadSectionElement = document.querySelector('.img-upload__form');
  var imageUploadOverlayElement = document.querySelector('.img-upload__overlay');
  var imageUploadInputElement = document.querySelector('#upload-file');


  var successHandler = function () {
    window.uploadSetup.close();
  };

  var anotherFileClickHolder = function () {
    window.uploadSetup.reset();
    document.querySelector('.img-upload__message--error').classList.add('hidden');
    imageUploadInputElement.click();
  };

  var retryClickHolder = function () {
    window.backend.save(new FormData(imageUploadFormElement), successHandler, errorHandler);
  };


  var errorHandler = function (error) {
    if (!document.querySelector('.img-upload__message--error')) {
      var errorElement = document.querySelector('#picture').content.querySelector('.img-upload__message--error').cloneNode(true);
      imageUploadSectionElement.appendChild(errorElement);
    }
    document.querySelector('.img-upload__message--error').childNodes[0].textContent = error;
    document.querySelector('.img-upload__message--error').classList.remove('hidden');
    imageUploadOverlayElement.classList.add('hidden');
    document.querySelector('#retry-request').addEventListener('click', retryClickHolder);
    document.querySelector('#upload-another-file').addEventListener('click', anotherFileClickHolder);
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
      tagsElement.style.border = '2px solid red';
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
        return 'Теги должны начинаться с #!';
      }
      if (tags[i].length < 2) {
        return 'В теге должен быть хотя бы один символ кроме #!';
      }
      if (tags[i].length > 20) {
        return 'В теге должно быть не более 20 символов включая #!';
      }
      if (tags[i].indexOf('#', 1) > 1) {
        return 'Теги нужно разделять пробелами!';
      }
      for (var j = i + 1; j < tags.length; j++) {
        if (tags[i].toLowerCase() === tags[j].toLowerCase()) {
          return 'Теги должны быть уникальными!';
        }
      }
    }
    if (tags.length > 5) {
      return 'Не более 5 тегов!';
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
