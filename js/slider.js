'use strict';
(function () {

  window.slider = {};

  var addScalePinMouseDownHandler = function (scale, pin, func) {

    var scalePinMouseDownHandler = function (innerEvt) {
      innerEvt.preventDefault();

      var startMouseCoord = innerEvt.clientX;
      var minCoord = scale.getBoundingClientRect().left;
      var maxCoord = minCoord + scale.clientWidth;
      var minPinOffsetLeft = minCoord - pin.clientWidth / 2;
      var maxPinOffsetLeft = maxCoord - pin.clientWidth / 2;
      var currentPinOffsetLeft = pin.getBoundingClientRect().left;

      var scalePinMouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();
        if (moveEvt.clientX >= minCoord && moveEvt.clientX <= maxCoord) {
          var shift = moveEvt.clientX - startMouseCoord;
          startMouseCoord = moveEvt.clientX;
          var newPinOffsetLeft = currentPinOffsetLeft + shift;
          if (newPinOffsetLeft >= minPinOffsetLeft && newPinOffsetLeft <= maxPinOffsetLeft) {
            currentPinOffsetLeft = newPinOffsetLeft;
            var coordProportion = ((currentPinOffsetLeft - minCoord + pin.clientWidth / 2) / scale.clientWidth) * 100;
            func(coordProportion);
          }
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

    var removeMouseDownHandler = function () {
      document.removeEventListener('click', scalePinMouseDownHandler);
    };

    window.slider.remove = removeMouseDownHandler;

    pin.addEventListener('mousedown', scalePinMouseDownHandler);
  };

  window.slider.init = addScalePinMouseDownHandler;
})();
