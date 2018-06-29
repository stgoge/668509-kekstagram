'use strict';
(function () {
  var SELECTED_FILTER_CLASS = 'img-filters__button--active';

  var filtersElement = document.querySelector('.img-filters');
  var filtersForm = document.querySelector('.img-filters__form');
  var currentFilterButtoniD = document.querySelector('.' + SELECTED_FILTER_CLASS).id;

  var buttonIdToFilter = {
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

  var showFilters = function () {
    window.gallery.render(buttonIdToFilter[currentFilterButtoniD]());
    filtersElement.classList.remove('img-filters--inactive');
    filtersForm.addEventListener('click', filtersFormClickHandler);
  };

  var changeButton = function (newFilterButton) {
    document.querySelector('#' + currentFilterButtoniD).classList.remove(SELECTED_FILTER_CLASS);
    currentFilterButtoniD = newFilterButton.id;
    newFilterButton.classList.add(SELECTED_FILTER_CLASS);
    filtersButtonChangeHandler();
  };


  var filtersFormClickHandler = function (evt) {
    if (evt.target.type === 'button' && evt.target.id !== currentFilterButtoniD) {
      changeButton(evt.target);
    }
  };

  var filtersButtonChangeHandler = window.debounce(function () {
    window.gallery.render(buttonIdToFilter[currentFilterButtoniD]());
  });

  window.filters = {
    show: showFilters
  };
})();
