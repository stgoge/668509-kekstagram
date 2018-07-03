'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var isTextInputNotInFocus = function (evt) {
    if (evt.target.type === 'text' || evt.target.type === 'textarea') {
      return false;
    }
    return true;
  };

  var addHandlers = function (element, func, modal) {

    var removeHandlers = function () {
      document.removeEventListener('keydown', documentKeydownHandler);
      element.removeEventListener('click', elementClickHandler);
      if (modal) {
        element.removeEventListener('keydown', elementKeydownHandler);
      }
    };

    var documentKeydownHandler = function (evt) {
      if (evt.keyCode === ESC_KEYCODE && isTextInputNotInFocus(evt)) {
        func();
        removeHandlers();
      }
    };

    var elementClickHandler = function (evt) {
      func(evt);
      if (modal) {
        removeHandlers();
      }
    };

    var elementKeydownHandler = function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        func(evt);
        if (modal) {
          removeHandlers();
        }
      }
    };

    element.addEventListener('keydown', elementKeydownHandler);
    element.addEventListener('click', elementClickHandler);
    if (modal) {
      document.addEventListener('keydown', documentKeydownHandler);
    }
  };

  window.handlers = {
    add: addHandlers
  };
})();
