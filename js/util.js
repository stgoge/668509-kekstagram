'use strict';
(function () {
  var getRandomIntFromRange = function (min, max) {
    return (Math.round((Math.random() * (max - min))) + min);
  };

  var getRandomListElement = function (list) {
    return list[getRandomIntFromRange(0, list.length - 1)];
  };

  var getPartOfRange = function (min, max, part) {
    return (part * (max - min) / 100 + min);
  };

  window.util = {
    getRandomIntFromRange: getRandomIntFromRange,
    getRandomListElement: getRandomListElement,
    getPartOfRange: getPartOfRange
  };
})();
