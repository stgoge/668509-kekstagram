'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var isTextInputNotInFocus = function (evt) {
    return !(evt.target.type === 'text' || evt.target.type === 'textarea');
  };

  var addHandlers = function (element, cb, modal) {

    var removeHandlers = function () {
      document.removeEventListener('keydown', documentKeydownHandler);
      element.removeEventListener('click', elementClickHandler);
      if (modal) {
        element.removeEventListener('keydown', elementKeydownHandler);
      }
    };

    var documentKeydownHandler = function (evt) {
      if (evt.keyCode === ESC_KEYCODE && isTextInputNotInFocus(evt)) {
        cb();
        removeHandlers();
      }
    };

    var elementClickHandler = function (evt) {
      cb(evt);
      if (modal) {
        removeHandlers();
      }
    };

    var elementKeydownHandler = function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        cb(evt);
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
