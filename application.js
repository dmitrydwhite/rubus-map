'use strict';

var app = (function() {
  var navClass;
  var lastLoc;

  // Set an event listener for navbar buttons
  $('.navbutton').click(function() {
    $('.navbutton').removeClass('nav_on');
    navClass = $(this).attr('class');
    $(this).addClass('nav_on');
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
        $('.loc_switch').text('USING GPS');
        findDevice();
      } else {
        $('.loc_switch').text('ENTER MANUALLY');
      }
    });
  };

  // Function to find device's location
  var findDevice = function() {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latString = position.coords.latitude.toString().slice(0,6);
      var longString = position.coords.longitude.toString().slice(0,7);
      var positionString = latString + ', ' + longString;
      lastLoc = positionString;
      $('.where').val(lastLoc);
    });
  };

  // Listener for "Share Berry Patch" button
  var sharePatch = function() {
    $('.button').click(function() {
      var patchData = {};
      patchData.loc = $('.where').val();
      patchData.fecundity = $('.how_many').val();
      patchData.maturity = $('.how_ripe').val();
      patchData.nature = 'pick';
      // TODO: Gather all data and submit to a database
      alert('You are Fixing to Share Your Berries!');
      console.log(patchData);
    });
  };

})();
