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
