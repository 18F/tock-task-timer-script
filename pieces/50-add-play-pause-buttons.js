(function add_play_pause_timer_buttons() {
  var play = '<i class="fa fa-play"></i>';
  var pause = '<i class="fa fa-pause"></i>';

  var startTime = 0;
  var tracking = false;
  
  var storedTimes = getTimesFromStorage();

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
})();
