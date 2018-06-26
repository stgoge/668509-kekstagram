'use strict';
(function () {
  var getRandomIntFromRange = function (min, max) {
    return (Math.round((Math.random() * (max - min))) + min);
  };

  var getRandomListElement = function (list) {
    return list[getRandomIntFromRange(0, list.length - 1)];
  };

  window.util = {
    getRandomIntFromRange: getRandomIntFromRange,
    getRandomListElement: getRandomListElement
  };
})();
