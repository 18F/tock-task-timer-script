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
