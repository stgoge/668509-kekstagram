'use strict';
(function () {
  var ESC_KEYCODE = 27;

  var modal = document.querySelector('.modal');
  var modalMessage = document.querySelector('.modal__message');
  var modalClose = modal.querySelector('.modal__close');

  var closeModal = function () {
    modal.classList.add('hidden');
    modalClose.removeEventListener('click', modalCloseClickHandler);
    document.removeEventListener('keydown', documentKeydownHandler);
  };

  var modalCloseClickHandler = function () {
    closeModal();
  };

  var documentKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeModal();
    }
  };

  var isModalHidden = function () {
    return modal.classList.contains('hidden');
  };

  var showMessage = function (error) {
    modalMessage.textContent = error;
    modal.classList.remove('hidden');
    modalClose.addEventListener('click', modalCloseClickHandler);
    document.addEventListener('keydown', documentKeydownHandler);
  };

  window.modal = {
    show: showMessage,
    isHidden: isModalHidden
  };
})();
