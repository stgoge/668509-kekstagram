'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  window.debounce = function (func) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        func.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
