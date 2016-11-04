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
