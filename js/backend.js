'use strict';
(function () {
  var SUCCESS_RESPONSE = 200;
  var ConnectionError = {
    STATUS: 'Cтатус ответа: ',
    TIMEOUT: 'Запрос не успел выполниться. Время(мс): ',
    CONNECTION: 'Произошла ошибка соединения'
  };
  var XhrParameter = {
    LOAD: {
      METHOD: 'GET',
      URL: 'https://js.dump.academy/kekstagram/data'
    },
    SAVE: {
      METHOD: 'POST',
      URL: 'https://js.dump.academy/kekstagram'
    }
  };

  var loadData = function (successHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      successHandler(xhr.response);
    });
    xhr.open(XhrParameter.LOAD.METHOD, XhrParameter.LOAD.URL);
    xhr.send();
  };

  var saveForm = function (data, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_RESPONSE) {
        successHandler(xhr.response);
      } else {
        errorHandler(ConnectionError.STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler(ConnectionError.CONNECTION);
    });

    xhr.addEventListener('timeout', function () {
      errorHandler(ConnectionError.TIMEOUT + xhr.timeout);
    });
    xhr.open(XhrParameter.SAVE.METHOD, XhrParameter.SAVE.URL);
    xhr.send(data);
  };

  window.backend = {
    load: loadData,
    save: saveForm
  };
})();
