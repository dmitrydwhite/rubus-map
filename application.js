'use strict';

var app = (function() {
  var navClass;

  // Set an event listener for navbar buttons
  $('.navbutton').click(function() {
    navClass = $(this).attr('class');
    reDraw();
  });

  // Set Listeners and Methods for "Picking" tab

  // Listener for toggling whether to use device
  // location for submit.
  var getLocation = function() {
    $('.toggler').click(function() {
      if ($('.loc_switch').text() === 'OFF') {
        $('.loc_switch').text('ON');
      } else {
        $('.loc_switch').text('OFF');
      }
    });
  }

  var reDraw = function() {
    if (navClass === 'navbutton picking') {
      $('.content').remove();
      $('.navbar').after(rubusTemplate);
      getLocation();
    }
    else {
      $('.content').remove();
      $('.navbar').after('<div class="content"></div>');
      $('.content').append('<div class="clear"></div>');
      $('.content').append('<p>This No Worky!</p>');
    }
  };

})();
