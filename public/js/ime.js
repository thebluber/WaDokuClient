'use strict';
/*jslint browser: true*/
/*global $, jQuery, alert, utils, api, desktop, mobile*/

function init() {
  var canvas = document.getElementById("pad");
  var buttons = {
    cleanAll: document.getElementById("cleanAll"),
    cleanLast: document.getElementById("cleanLast"),
    save: document.getElementById("save")
  };
  if(canvas.getContext){
    if(screen.width <= 800){
      //this is necessary for preventing auto-hiding and auto-displaying of address bar on mobile devices causing the canvas to jiggle
      if ($('body').css('position') === 'fixed'){
        $('body').css({'position': 'relative'});
      } else {
        $('body').css({'position': 'fixed'});
      }
      mobile(canvas, buttons);
    } else {
      desktop(canvas, buttons);
    }
  } else {
    alert("Your browser does not support canvas!");
  }
}
//$( document ).ready(init);
document.addEventListener( "DOMContentLoaded", function(){
  // setup a new canvas for drawing wait for device init

  $('#ime-toggle').click(function(){
    $('#ime').toggle(function() {
      $('#results').html('');
      init();
    });
    $('.buttons').toggle();
  });
}, false );

