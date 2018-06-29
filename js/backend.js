'use strict';
(function () {
  var SUCCESS_RESPONSE = 200;
  var ConnectionError = {
    STATUS: 'Cтатус ответа: ',
    TIMEOUT: 'Запрос не успел выполниться. Время(мс): ',
    CONNECTION: 'Произошла ошибка соединения'
  };
  var XhrParameter = {
    Load: {
      METHOD: 'GET',
      URL: 'https://js.dump.academy/kekstagram/data'
    },
    Save: {
      METHOD: 'POST',
      URL: 'https://js.dump.ac1ademy/kekstagram'
    }
  };

  var initXhr = function (loadHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_RESPONSE) {
        loadHandler(xhr.response);
      } else {
        window.modal.show(ConnectionError.STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      window.modal.show(ConnectionError.CONNECTION);
    });

    xhr.addEventListener('timeout', function () {
      window.modal.show(ConnectionError.TIMEOUT + xhr.timeout);
    });
    return xhr;
  };

  var loadData = function (successHandler) {
    var xhr = initXhr(successHandler);
    xhr.open(XhrParameter.Load.METHOD, XhrParameter.Load.URL);
    xhr.send();
  };

  var saveForm = function (data, successHandler) {
    var xhr = initXhr(successHandler);
    xhr.open(XhrParameter.Save.METHOD, XhrParameter.Save.URL);
    xhr.send(data);
  };

  window.backend = {
    load: loadData,
    save: saveForm
  };
})();
