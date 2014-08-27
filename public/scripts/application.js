'use strict';

var app = (function() {
  var navClass = 'navbutton picking';
  // var Coords = new RegExp(/^\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?$/);
  var lastLoc;
  var map;
  var heatMapData = [];
  var pointData = [];

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
      $('.navbar').after(pickingTemplate);
      getLocation();
      sharePatch();
    }
    else if (navClass === 'navbutton finding') {
      $('.content').remove();
      $('.navbar').after(findingTemplate);
      initialize();
    } else {
    // TODO: Create templates for "jamming"
      $('.content').remove();
      $('.navbar').after(jammingTemplate);
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
        $('.where').val(lastLoc || '');
        $('.where').attr('placeholder', 'Type an address or coordinates');
        $('.loc_switch').text('ENTER MANUALLY');
      }
    });
  };

  // Function to find device's location
  var findDevice = function() {
    $('.where').attr('placeholder', 'Using device GPS location...');
    $('.where').val('');
    navigator.geolocation.getCurrentPosition(function (position) {
      var latString = position.coords.latitude.toString().slice(0,6);
      var longString = position.coords.longitude.toString().slice(0,7);
      var positionString = latString + ', ' + longString;
      lastLoc = positionString;
      $('.where').val(lastLoc);
    });
  };

  // Check function for submitting to geocode
  var geoCode = function(valueString, cb) {
    var codedObject = '';
    var isCoordinate = /^-?\d+\.?\d*,?\s?-?\d?\d?\d?\.?\d*$/;
    if (isCoordinate.test(valueString)) {
      codedObject = valueString;
      console.log('true');
      cb(codedObject);
    } else {
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
      var address = valueString.split(' ');
      address.forEach(function(block) {
        url += block + '+';
      });
      url += '&key=AIzaSyAaUu9l8yI8zgkWDu-7EopI-G4yz3jQVGo';
      $.ajax(url).then(function(response) {
          console.log(response);
          codedObject += response.results[0].geometry.location.lat.toString() + ', ';
          codedObject += response.results[0].geometry.location.lng.toString();
          lastLoc = codedObject;
          console.log(lastLoc);
          cb(codedObject);
        });
    }
  };

  // Listener for "Share Berry Patch" button
  var sharePatch = function() {
    $('.button').click(function() {
      if ($('.where').val().toString().trim() === '') {
        $('.button').text('Must Enter Location')
          .addClass('location_fail');
        watchLocationEntry();
      } else {
        lastLoc = $('.where').val();
        geoCode($('.where').val(), postPatch);
      }
    });
  };

  // Callback function after user-inputted location has been geocoded
  var postPatch = function(locationValue) {
    var patchData = {};
    patchData.location = locationValue;
    patchData.fecundity = $('.how_many').val();
    patchData.maturity = $('.how_ripe').val();
    patchData.name = $('.name').val();
    patchData.description = $('.description').val();
    // TODO: Add timestamp for data decay
    $.ajax('/api/patches', {
      method: 'POST',
      data: patchData});
    console.log(patchData);
    $('.content').remove();
    $('.navbar').after(submittedTemplate);
    moveAlong();
  };

  //Listener for "Where" Input having value
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

  // Initialize Google Map
  var initialize = function() {
    var mapCenter =
      lastLoc ? [located(lastLoc).lat, located(lastLoc).lng]
      : [45.05, -123.01];

    var mapOptions = {
      center: new google.maps.LatLng(mapCenter[0], mapCenter[1]),
      zoom: 12
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    getPatches();
  };

  // Helper function to deserialize the string location data for use by
  // Google Maps API
  var located = function(obj) {
    var locationData = {};
    if (obj.location) {
      locationData.lat = parseFloat(obj.location.split(',')[0]);
      locationData.lng = parseFloat(obj.location.split(',')[1]);
    } else {
      locationData.lat = parseFloat(obj.split(',')[0]);
      locationData.lng = parseFloat(obj.split(',')[1]);
    }
    return locationData;
  };

  // Retrieve the previously submitted patches from the
  // database
  var getPatches = function() {
    $.ajax('/api/patches', {method: 'GET'})
      .then(function(data) {
        mapMarkers(data.patches);
        watchHeat();
      });
  };

  // Plot the dataset as markers on the map.
  var mapMarkers = function(array) {
    console.log(array);
    if (array.length > 0) {
      array.forEach(function(point) {
        var pointWeight = (point.fecundity + point.maturity)/20;
        var pointLoc = located(point);
        var markerLocation = new google.maps.LatLng(pointLoc.lat, pointLoc.lng);
        var marker = new google.maps.Marker({
          position: markerLocation,
          weight: pointWeight,
          map: map
        });
        pointData.push(marker);
        heatMapData.push({location: markerLocation, weight: pointWeight});
      });
    }
  };

  // Listener for berry marker option
  var watchBerryMarkers = function(heatmap) {
    $('.berries').click(function() {
      heatmap.setMap(null);
    });
  };

  // Listener for heatmap option
  var watchHeat = function() {
    $('.heat').click(function() {
      pointData.forEach(function(marker) {
        marker.setMap(null);
      });
      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData
      });
      heatmap.setMap(map);
      heatmap.set('radius', 80);
      watchBerryMarkers(heatmap);
    });
  };

})();
