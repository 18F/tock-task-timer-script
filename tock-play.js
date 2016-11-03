(function($) {

  (function add_css_to_head() {
    var css =
      '.entry-start {\
        float: left;\
        margin-right: 2rem;\
        padding: 0.5rem 1rem;\
        background-color: #046b99;\
        color: white;\
        border-radius: 3px;\
        cursor: pointer;\
      }\
      \
      .entry-elapsed {\
        float: left;\
      }\
      button.tock-play {\
        margin: 1rem;\
      }';
    $('head').append('<style type="text/css">' + css + '</style>');
  })();

  var play = '<i class="fa fa-play"></i>';
  var pause = '<i class="fa fa-pause"></i>';

  (function add_clear_and_tock_buttons() {
    var clearButton = $('<button class="tock-play">Clear Timers</button>');
    var tockButton = $('<button class="tock-play">Tock the Timers</button>');
    var theForm = $('.form-horizontal.form-inline');

    $('<div style="clear: both;"/>').insertBefore(theForm);
    clearButton.insertBefore(theForm);
    tockButton.insertBefore(theForm);

    var clearTimers = function(e) {
      e.stopPropagation();

      $('.entry-elapsed').each(function(i, entry) {
        $(entry).data('minutes', 0);
        $(entry).text('0:00');
      });

      if(interval) {
        clearInterval(interval);
        interval = false;
      }

      populateHourTotals();
      storeTimes();
    }

    var tockTheTimers = function(e) {
      e.stopPropagation();
      $('.entry-elapsed').each(function(i, entry) {
        entry = $(entry);
        var input = $('input', entry.siblings('.entry-amount'));
        var newHours = Math.floor(entry.data('minutes') / 15) / 4;
        input.val(Number(input.val()) + newHours);
      });

      clearTimers(e);

      setTimeout(function() {
        alert('Your timers have been added to your Tock lines, and the timers reset.  Don\'t forget to save!');
      }, 10);
    }

    clearButton.click(clearTimers);
    tockButton.click(tockTheTimers);
  })();

  // Attach change listeners to all the actual Tock time boxes
  // so we can dump those values into local storage.  No more
  // accidental lost time!

  var startTime = 0;
  var tracking = false;
  var interval = false;

  function getMinutesDisplay(minutes) {
    var remainderSeconds = Math.floor((minutes - Math.floor(minutes)) * 60);
    minutes = Math.floor(minutes);

    var hours = '';
    if(minutes > 60) {
      hours = Math.floor(minutes / 60);
      minutes = minutes - (hours * 60);
      hours = hours + ':';
    }

    return hours + (minutes < 10 ? '0' : '') + minutes + ':' + (remainderSeconds < 10 ? '0' : '') + remainderSeconds;
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

  var addTimersToTotal = (function() {
    var total = $('.entries-total-reported-wrapper').clone();
    total.text();
    total.insertAfter($('.entries-total-reported-wrapper'));

    return function() {
      var time = 0;
      $('.entry-elapsed').each(function(i, entry) {
        time += $(entry).data('minutes');
      });

      time += (Number($('.entries-total-reported-amount').text()) * 60);

      total.text('or ' + getMinutesDisplay(time) + ' with timers');
    };
  })();

  // Add play/pause timer buttons and timer counters next to
  // each tock line
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
    addTimersToTotal();

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
        addTimersToTotal(getMinutesDisplay());
        storeTimes();

      }, 1000);
    })
  });

  // If local storage is available...
  //   1) overwrite the populateHourTotals method to save times
  //      to local storage as they're changed
  //   2) clear the local storage when the form is saved
  //   3) restore hours from local storage when the page is loaded
  if(window.localStorage) {
    var __original_populateHourTotals = populateHourTotals;
    populateHourTotals = function() {
      var hoursAsEntered = { };
      $('.entries .entry').each(function(i, entry) {
        entry = $(entry);
        var project = $('.entry-project select', entry).val();
        var hours = $('.entry-amount input', entry).val();
        hoursAsEntered[project] = hours;
      });

      window.localStorage.setItem('tock-entered-hours', JSON.stringify(hoursAsEntered));
      __original_populateHourTotals();
    };

    $("#save-timecard").on("click", function() {
      window.localStorage.removeItem('tock-entered-hours');
    });

    var entered = window.localStorage.getItem('tock-entered-hours');
    if(entered) {
      entered = JSON.parse(entered);
      $('.entries .entry').each(function(i, entry) {
        entry = $(entry);
        var project = $('.entry-project select', entry).val();
        if(entered[project]) {
          $('.entry-amount input', entry).val(Number(entered[project]));
        }
      });
      populateHourTotals();
    }
  }
})($)
