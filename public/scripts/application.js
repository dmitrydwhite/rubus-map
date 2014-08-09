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
    else if (navClass === 'navbutton finding') {
      $('.content').remove();
      $('.navbar').after(nanciscor);
      initialize();
    } else {
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
      if (!$('.where').val()) {
        $('.button').text('Must Enter Location')
          .addClass('location_fail');
        watchLocationEntry();
      } else {
        var patchData = {};
        patchData.location = $('.where').val();
        // TODO: Check for location type, convert
        // to GPS coordinates as necessary before storing
        patchData.fecundity = $('.how_many').val();
        patchData.maturity = $('.how_ripe').val();
        patchData.name = $('.name').val();
        patchData.description = $('.description').val();
        // TODO: Add timestamp for data decay
        console.log(patchData);
        $.ajax('../api/patches', {
          method: 'POST',
          data: patchData});
        $('.content').remove();
        $('.navbar').after(submitted);
        moveAlong();
      }
    });
  };

  //Listener for Where Input having value
  var watchLocationEntry = function() {
    // TODO: Make this better.  The submit button
    // should change when the user enters any value
    // into the location input or when the user uses
    // the device GPS location detection.
    $('.where').change(function() {
      console.log('where is changed');
      if ($('.where').val()) {
        console.log('where has value');
        $('.button').removeClass('location_fail')
          .text('Share This Berry Patch');
      }
    });
  };

  // Listener for buttons after patch submitted
  var moveAlong = function() {
    $('.info_button').click(function() {
      if ($(this).attr('class') === 'info_button find') {
        navClass = 'navbutton finding';
        $('.navbutton').removeClass('nav_on');
        $('.finding').addClass('nav_on');
      }
      reDraw();
    });
  };

  // Set Listeners and Methods for "Finding" tab

  var initialize = function() {
    var mapOptions = {
      center: new google.maps.LatLng(45.07, -123.04),
      zoom: 12
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  };

})();
