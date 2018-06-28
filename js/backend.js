'use strict';
(function () {
  var SUCCESS_RESPONSE = 200;
  var ERROR = {
    status: 'Cтатус ответа: ',
    timeout: 'Запрос не успел выполниться. Время(мс): ',
    connection: 'Произошла ошибка соединения'
  };
  var XHR_PARAMETERS = {
    load: {
      method: 'GET',
      url: 'https://js.dump.academy/kekstagram/data'
    },
    save: {
      method: 'POST',
      url: 'https://js.dump.ac1ademy/kekstagram'
    }
  };

  var initXhr = function (loadHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_RESPONSE) {
        loadHandler(xhr.response);
      } else {
        window.modal.show(ERROR.status + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      window.modal.show(ERROR.connection);
    });

    xhr.addEventListener('timeout', function () {
      window.modal.show(ERROR.timeout + xhr.timeout);
    });
    return xhr;
  };

  var loadData = function (successHandler) {
    var xhr = initXhr(successHandler);
    xhr.open(XHR_PARAMETERS.load.method, XHR_PARAMETERS.load.url);
    xhr.send();
  };

  var saveForm = function (data, successHandler) {
    var xhr = initXhr(successHandler);
    xhr.open(XHR_PARAMETERS.save.method, XHR_PARAMETERS.save.url);
    xhr.send(data);
  };

  window.backend = {
    load: loadData,
    save: saveForm
  };
})();
