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
