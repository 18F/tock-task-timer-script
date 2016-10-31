(function($) {
  var css =
    '.yo, .entry-start {\
      float: left;\
      margin-right: 2rem;\
      padding: 0.5rem 1rem;\
      background-color: #477dca;\
      color: white;\
      border-radius: 3px;\
      cursor: pointer;\
    }\
    \
    .entry-elapsed {\
      float: left;\
    }\
    button.tock-play {\
      margin: 0 1rem;\
    }';
  $('head').append('<style type="text/css">' + css + '</style>');

  var play = '<i class="fa fa-play"></i>';
  var pause = '<i class="fa fa-pause"></i>';

  (function() {
    var clearButton = $('<button class="tock-play">Clear Timers</button>');
    var tockButton = $('<button class="tock-play">Tock the Timers</button>');
    var theForm = $('.form-horizontal.form-inline');

    clearButton.click(clearTimers);
    tockButton.click(tockTheTimers);

    $('<div style="clear: both;"/>').insertBefore(theForm);
    clearButton.insertBefore(theForm);
    tockButton.insertBefore(theForm);
  })();

  function clearTimers(e) {
    e.stopPropagation();

    $('.entry-elapsed').each(function(i, entry) {
      $(entry).data('minutes', 0);
      $(entry).text('0:00');
    });

    if(interval) {
      clearInterval(interval);
      interval = false;
    }

    storeTimes();
  }

  function tockTheTimers(e) {
    e.stopPropagation();

    $('.entry-elapsed').each(function(i, entry) {
      entry = $(entry);
      var input = $('input', entry.siblings('.entry-amount'));
      var newHours = Math.floor(entry.data('minutes') / 15) / 4;
      input.val(Number(input.val()) + newHours);
    });

    populateHourTotals();
    clearTimers(e);

    setTimeout(function() {
      alert('Your timers have been added to your Tock lines, and the timers reset.  Don\'t forget to save!');
    }, 10);
  }

  var startTime = 0;
  var tracking = false;
  var interval = false;

  function getMinutesDisplay(minutes) {
    var remainderSeconds = Math.floor((minutes - Math.floor(minutes)) * 60);
    return Math.floor(minutes) + ':' + (remainderSeconds < 10 ? '0' : '') + remainderSeconds;
  }

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

  var storedTimes = getTimesFromStorage();

  $('.entries .entry-amount').each(function(i, element) {
    var start = $('<div class="entry-start">' + play + '</div>');
    var elapsed = $('<div class="entry-elapsed">0:00</div>');
    elapsed.data('minutes', 0);

    start.insertAfter($(element).next());
    elapsed.insertAfter(start);

    var tockID = $('select', $(element).siblings('.entry-project')).val();
    if(storedTimes[tockID]) {
      elapsed.text(getMinutesDisplay(storedTimes[tockID]));
      elapsed.data('minutes', storedTimes[tockID]);
    }

    start.click(function(e) {
      // Don't let anything else get this event.
      e.stopPropagation();

      var self = (tracking === element);

      if(tracking) {
        clearInterval(interval);
        $(tracking).siblings('.entry-start').html(play);
        tracking = false;
        interval = false;
      }

      // If we're tracking this line and it got clicked again,
      // we only needed to clear the tracking.  Don't start
      // tracking it again!
      if(self) {
        return;
      }

      start.html(pause);
      tracking = element;
      startTime = Date.now() - (elapsed.data('minutes') * 60000);

      interval = setInterval(function() {
        var elapsedMinutes = (Date.now() - startTime) / 60000;
        elapsed.data('minutes', elapsedMinutes);
        elapsed.text(getMinutesDisplay(elapsedMinutes));
        storeTimes();

      }, 1000);
    })
  })
})($)
