'use strict';
(function () {
  var SELECTED_BUTTON_CLASS = 'img-filters__button--active';
  var NEW_POSTS_COUNT = 10;

  var filtersElement = document.querySelector('.img-filters');
  var filtersFormElement = document.querySelector('.img-filters__form');

  var buttonIdToPostFilter = {
    'filter-popular': function () {
      return window.data.posts;
    },

    'filter-new': function () {
      var postsCopy = window.data.posts.slice();
      var j;
      var temp;
      for (var i = postsCopy.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = postsCopy[j];
        postsCopy[j] = postsCopy[i];
        postsCopy[i] = temp;
      }
      return postsCopy.slice(0, NEW_POSTS_COUNT);
    },

    'filter-discussed': function () {
      var sortedByCommentsCountList = window.data.posts.slice();
      sortedByCommentsCountList.sort(function (first, second) {
        return second.comments.length - first.comments.length;
      });
      return sortedByCommentsCountList;
    }
  };

  var getActiveButtonId = function () {
    return document.querySelector('.' + SELECTED_BUTTON_CLASS).id;
  };

  var buttonChangeHandler = window.debounce(function () {
    window.gallery.render(buttonIdToPostFilter[getActiveButtonId()]());
  });

  var changeButton = function (newButton) {
    document.querySelector('#' + getActiveButtonId()).classList.remove(SELECTED_BUTTON_CLASS);
    newButton.classList.add(SELECTED_BUTTON_CLASS);
    buttonChangeHandler();
  };

  var showFilters = function () {
    buttonChangeHandler();
    filtersElement.classList.remove('img-filters--inactive');
    filtersFormElement.addEventListener('click', function (evt) {
      if (evt.target.type === 'button' && evt.target.id !== getActiveButtonId()) {
        changeButton(evt.target);
      }
    });
  };

  window.filters = {
    show: showFilters
  };
})();
