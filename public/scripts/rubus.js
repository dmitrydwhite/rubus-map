'use strict';

var pickingTemplate =
  '<div class="content">' +
  '<div class="button">Share This Berry Patch</div>' +
  '<div class="toggler">Use Current Device Location?' +
  '<div class="loc_switch">ENTER MANUALLY</div></div>' +
  '<p class="input_text">Where?</p>' +
  '<input class="where" type="text" ' +
  'placeholder="Type an address or coordinates">' +
  '<p>How Many?</p>' +
  '<input class="how_many" type="range">' +
  '<p>How Ripe?</p>' +
  '<input class="how_ripe" type="range">' +
  '<p>Name this Berry Patch</p>' +
  '<input type="text" class="name" ' +
  'placeholder="Type the name">' +
  '<p>Describe where the berries are:</p>' +
  '<textarea class="description"></textarea>' +
  '<div class="button">Share This Berry Patch</div>' +
  '</div>';

var submittedTemplate =
  '<div class="content">' +
  '<div class="info">' +
  'You have successfully submitted this Berry Patch' +
  '</div>' +
  '<div class="info_button find">' +
  'FIND MORE PATCHES' +
  '</div>' +
  '<div class="info_button pick">' +
  'SUBMIT ANOTHER PATCH' +
  '</div>' +
  '</div>';

var findingTemplate =
  '<div class="content">' +
  '<div id="map-canvas">' +
  '</div>' +
  '<div class="map_buttons">' +
  '<div class="layer jam">FIND JAM</div>' +
  '<div class="layer berries">FIND BERRIES</div>' +
  '</div>' +
  '</div>';
