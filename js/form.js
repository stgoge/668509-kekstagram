'use strict';
(function () {
  var tagsElement = document.querySelector('.text__hashtags');
  var imageUploadForm = document.querySelector('#upload-select-image');

  var successHandler = function () {
    window.uploadSetup.close();
  };

  var imageUploadFormSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(imageUploadForm), successHandler);
  };

  var addImageUploadFormSubmitHandler = function () {
    imageUploadForm.addEventListener('submit', imageUploadFormSubmitHandler);
  };

  var removeImageUploadFormSubmitHandler = function () {
    imageUploadForm.removeEventListener('submit', imageUploadFormSubmitHandler);
  };

  var tagsElementInputHandler = function (evt) {
    tagsElement.setCustomValidity(checkTagsValidity(evt));
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
    return '';
  };

  window.form = {
    addTagsHandler: addTagsElementInputHandler,
    removeTagsHandler: removeTagsElementInputHandler,
    addSubmitHandler: addImageUploadFormSubmitHandler,
    removeSubmitHandler: removeImageUploadFormSubmitHandler
  };
})();
