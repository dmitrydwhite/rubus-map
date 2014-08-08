'use strict';

var app = (function() {
  var navClass;

  // Set an event listener for navbar buttons
  $('.navbutton').click(function() {
    navClass = $(this).attr('class');
    reDraw();
  });

  // Helper function for Navbar Listener
  var reDraw = function() {
    if (navClass === 'navbutton picking') {
      $('.content').remove();
      $('.navbar').after(rubusTemplate);
      getLocation();
      sharePatch();
    }
    else {
      $('.content').remove();
      $('.navbar').after('<div class="content"></div>');
      $('.content').append('<div class="clear"></div>');
      $('.content').append($('<p>', {
        'class': 'error_msg',
        text: 'We\'re sorry, this function is still ' +
          'under construction. Please check back soon!'
      }));
    }
  };

  // Set Listeners and Methods for "Picking" tab

  // Listener for toggling whether to use device
  // location for submit.
  var getLocation = function() {
    $('.toggler').click(function() {
      if ($('.loc_switch').text() === 'ENTER MANUALLY') {
        $('.loc_switch').text('USE GPS');
      } else {
        $('.loc_switch').text('ENTER MANUALLY');
      }
    });
  };

  // Listener for "Share Berry Patch" button
  var sharePatch = function() {
    $('.button').click(function() {
      // TODO: Gather all data and submit to a database
      alert('You are Fixing to Share Your Berries!');
    });
  };


})();
