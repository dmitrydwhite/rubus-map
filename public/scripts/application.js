'use strict';

var app = (function() {
  var navClass = 'navbutton picking';
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
    // TODO: Create templates for "jamming" and "finding"
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
  // TODO: Set Listeners and methods for other two tabs

  // Listener for toggling whether to use device
  // location for submit.
  var getLocation = function() {
    $('.toggler').click(function() {
      if ($('.loc_switch').text() === 'ENTER MANUALLY') {
        $('.loc_switch').text('USING GPS');
        findDevice();
      } else {
        $('.where').val('');
        $('.where').attr('placeholder', 'Type an address or coordinates');
        $('.loc_switch').text('ENTER MANUALLY');
      }
    });
  };

  // Function to find device's location
  var findDevice = function() {
    $('.where').attr('placeholder', 'Using device GPS location...')
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
      patchData.location = $('.where').val();
      // TODO: Check for location type, handle
      // error if no location is provided, convert
      // to GPS coordinates as necessary before storing
      patchData.fecundity = $('.how_many').val();
      patchData.maturity = $('.how_ripe').val();
      // patchData.nature = 'pick';
      // TODO: Add timestamp for data decay
      // TODO: Submit gathered data to a database
      console.log(patchData);
      $.ajax('../api/patches', {
        method: 'POST',
        data: patchData});
      $('.content').remove();
      $('.navbar').after(submitted);
      moveAlong();
    });
  };

  // Listener for buttons after patch submitted
  var moveAlong = function() {
    $('.info_button').click(function() {
      if ($(this).attr('class') === 'info_button find') {
        navClass = 'navbutton finding';
        $('.navbutton').removeClass('nav_on');
        $('.navbutton finding').addClass('nav_on');
      }
      reDraw();
    });
  };

})();
