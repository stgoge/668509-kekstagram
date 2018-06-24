'use strict';
(function () {
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

  window.checkForm = {
    checkTagsValidity: checkTagsValidity
  };
})();
