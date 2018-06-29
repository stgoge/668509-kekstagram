'use strict';
(function () {
  var SELECTED_BUTTON_CLASS = 'img-filters__button--active';

  var filtersElement = document.querySelector('.img-filters');
  var filtersForm = document.querySelector('.img-filters__form');
  var selectedButtoniD = document.querySelector('.' + SELECTED_BUTTON_CLASS).id;

  var buttonIdToPostsList = {
    'filter-popular': function () {
      return window.data.posts;
    },

    'filter-new': function () {
      var NEW_POSTS_COUNT = 10;

      var randomIndexList = window.data.posts.slice();
      randomIndexList.forEach(function (post) {
        post.randomIndex = Math.random();
      });
      randomIndexList.sort(function (first, second) {
        return first.randomIndex - second.randomIndex;
      });
      return randomIndexList.slice(0, NEW_POSTS_COUNT);
    },

    'filter-discussed': function () {
      var sortedByCommentsCountList = window.data.posts.slice();
      sortedByCommentsCountList.sort(function (first, second) {
        return second.comments.length - first.comments.length;
      });
      return sortedByCommentsCountList;
    }
  };

  var buttonChangeHandler = window.debounce(function () {
    window.gallery.render(buttonIdToPostsList[selectedButtoniD]());
  });

  var changeButton = function (newButton) {
    document.querySelector('#' + selectedButtoniD).classList.remove(SELECTED_BUTTON_CLASS);
    selectedButtoniD = newButton.id;
    newButton.classList.add(SELECTED_BUTTON_CLASS);
    buttonChangeHandler();
  };

  var showFilters = function () {
    window.gallery.render(buttonIdToPostsList[selectedButtoniD]());
    filtersElement.classList.remove('img-filters--inactive');
    filtersForm.addEventListener('click', function (evt) {
      if (evt.target.type === 'button' && evt.target.id !== selectedButtoniD) {
        changeButton(evt.target);
      }
    });
  };

  window.filters = {
    show: showFilters
  };
})();
