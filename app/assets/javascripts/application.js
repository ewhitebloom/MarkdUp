/* This is a manifest file that'll be compiled into application.js, which will include all the files
* listed below.
*
* Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
* or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
*
* It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
* the compiled file.
*
//= require jquery
//= require jquery_ujs
//= require jquery.ui.all
//= require_tree .
*/

    $('#toggle').click( function() {
      $('#listdiv').toggle(1000);
    });
//= require jquery.infinitescroll
