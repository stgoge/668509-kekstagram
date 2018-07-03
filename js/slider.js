'use strict';
(function () {

  var addScalePinMouseDownHandler = function (scale, pin, func) {

    var scalePinMouseDownHandler = function (innerEvt) {
      innerEvt.preventDefault();
      var startMouseCoord = innerEvt.clientX;

      var minCoord = scale.getBoundingClientRect().left + pin.clientWidth / 2;
      var maxCoord = minCoord + scale.clientWidth - pin.clientWidth;
      var currentPinOffsetLeft = pin.getBoundingClientRect().left;

      var scalePinMouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();
        if (moveEvt.clientX >= minCoord && moveEvt.clientX <= maxCoord) {
          var shift = moveEvt.clientX - startMouseCoord;
          startMouseCoord = moveEvt.clientX;
          currentPinOffsetLeft += shift;
          var coordProportion = ((currentPinOffsetLeft - minCoord + pin.clientWidth) / scale.clientWidth) * 100;
          func(coordProportion);
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
    pin.addEventListener('mousedown', scalePinMouseDownHandler);
  };

  window.slider = {
    init: addScalePinMouseDownHandler
  };
})();
