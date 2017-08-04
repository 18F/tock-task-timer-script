var storeTimes = (function() {
  if(window.localStorage) {
    return function() {
      var elapsedTimes = { };
      $('.entry-elapsed').each(function(i, entry) {
        entry = $(entry);
        elapsedTimes[$('select', entry.siblings('.entry-project')).val()] = entry.data('minutes');
      });
      window.localStorage.setItem('tock-play-elapsed-minutes', JSON.stringify(elapsedTimes));
    };
  } else {
    return function() { };
  }
})();

var getTimesFromStorage = (function() {
  if(window.localStorage) {
    return function() {
      var stored = window.localStorage.getItem('tock-play-elapsed-minutes');
      var times = { };
      if(stored) {
        times = JSON.parse(stored);
      }
      return times;
    };
  } else {
    return function() { };
  }
})();
