// Add chatroom feature, with ability to IM people within certain radius of you?
// Ability to comment on a post. Perhaps if you click on the map post, it would direct you to the list-view, where you could comment on the post?
$(document).ready(function(){
  $("#map").hide().fadeIn(3180);
  $("#headline").hide().fadeIn(1500);
  $("#subtitle").hide().fadeIn(1500);
});

var map;
var markersArray = [];
var markers=[];
var postwindows=[];

$("#map_canvas").load(function(){
  $("#loader").hide();
});

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray = new Array();
}

function clearPostWindows() {
  for (var i = 0; i < postwindows.length; i++ ) {
    postwindows[i].close();
  }
  postwindows = new Array();
}

function getmarkersvoting() {
// If marker is popular, have the icon be the same with a golden 'glow' or shadow around the original marker icon. With jQuery: $('marker').css('box-shadow: 0px 0px 10px yellow;', 'url(greenmarker)');
var greenmarker  = '/assets/greenmarker.png';
var blackmarker  = '/assets/blackmarker.png';
var bluemarker   = '/assets/bluemarker.png';
var graymarker   = '/assets/graymarker.png';
var orangemarker = '/assets/orangemarker.png';
var yellowmarker = '/assets/yellowmarker.png';
var redmarker    = '/assets/redmarker.png';
var purplemarker = '/assets/purplemarker.png';
var brownmarker  = '/assets/brownmarker.png';
var limemarker  = '/assets/lime.png';
var pinkmarker  = '/assets/pinkmarker.png';
var lightbluemarker  = '/assets/lightbluemarker.png';

$.getJSON("/microposts/show.json", {}, function(json){
  var micropostId = null;

  $(document).on("click", "#votelink", function(event){
    event.preventDefault();

    if (micropostId) {
      $.ajax({
        type: "POST",
        url: '/microposts/' + micropostId + '/vote_up.json',
        success: function() {
          $("#votelink").css({"background-color": "red", "color": "white"});
        }
      });
    }
  });

  $.each(json, function(i,item){
    $("#markers").append();


    var markericon = { "News": greenmarker, "Transportation": redmarker, "Personal": bluemarker, "Parks/Public Works": limemarker , "Restaurants": orangemarker, "Event": graymarker,"Shops": purplemarker,"Entertainment": yellowmarker,"Healthcare": brownmarker, "Government": lightbluemarker ,"Neighborhood": pinkmarker , "Other": blackmarker };
    var currenticon = markericon[item.category];

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(item.latitude, item.longitude),
      icon: currenticon,
      map: map
    });

    var votingref = document.getElementById('votelink');

    markers[i] = marker;

    $.getJSON('/microposts/' + item.id + '/votes_for.json', {}, function(votedata){
      if (votedata > 1) {
        var $currentIcon = $("#currenticon");
        $currenticon.addClass('.marker_glow');
      }

      var contentstring = '<div id="infocss">' + '<div id="categorycss">' + item.category + '</div>' + '<div id="contentcss">' + item.content + '</div>' + '<div id="votestyle">' + votedata + '</div>' + votingref.outerHTML + '</div>';

      var postwindow = new google.maps.InfoWindow({
        content: contentstring
      });

      google.maps.event.addListener(marker, 'mouseover', function() {
        clearPostWindows();
        postwindows.push(postwindow);
        postwindow.open(map, marker);
        micropostId = item.id;
      });
    });
  });
});
}

function initialize() {

  $(document).ready(function() {

    var mapOptions = {
      zoom: 14
    };
    map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);

        var currentlocation = new google.maps.Marker({
          map: map,
          position: pos,
          icon: '/assets/blue_dot.png'
        });

        map.setCenter(pos);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {

      handleNoGeolocation(false);
    }

    google.maps.event.addListener(map, 'click', function(event) {
      createMarker(event.latLng, "markername");

    });
    getmarkersvoting();
  });
}
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed. Please reload page.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(42.360881, -71.060772),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function createMarker(latlng, name) {
  var contents = document.getElementById('microformref');
  var whitemarker  = '/assets/whitemarker.png';
  var marker = new google.maps.Marker({
    icon: whitemarker,
    position: latlng,
    map: map,
    draggable: true,
    zIndex: Math.round(latlng.lat()*-100000)<<5
  });

  $('#formsubmit').click( function() {
    var coordinatex = markersArray[0].getPosition().lat();
    var coordinatey = markersArray[0].getPosition().lng();
    $.ajax({
      type: "POST",
      url: $("#microformref").attr('action'),
      data: $("#microformref").serialize() + '&' +
      $.param({ micropost: { latitude: coordinatex, longitude: coordinatey }}),
      datatype: 'json',
      success: function(){
        $("#microformref").prepend("Post Successful!").hide().fadeIn();
        getmarkersvoting ();
      },
      error: function(){
        $("#microformref").prepend("Try Again: Failed to Post").hide().fadeIn();
      }
    })
    return false;
  });

  google.maps.event.addListener(marker, 'click', function() {
    clearOverlays();
    var infowindow = new google.maps.InfoWindow();
    markersArray.push(marker);
    infowindow.setContent(contents);
    infowindow.open(map,marker);
  });

  google.maps.event.trigger(marker, 'click');
}
