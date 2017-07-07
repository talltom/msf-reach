// Create map
var newEventMap = L.map('map').setView([-6.8, 108.7], 7);

// Add some base tiles
var stamenTerrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

// Add some satellite tiles
var mapboxSatellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG9tYXN1c2VyZ3JvdXAiLCJhIjoiY2o0cHBlM3lqMXpkdTJxcXN4bjV2aHl1aCJ9.AjzPLmfwY4MB4317m4GBNQ', {
  attribution: '© Mapbox © OpenStreetMap © DigitalGlobe'
}).addTo(newEventMap);

var baseMaps = {
  "Terrain": stamenTerrain,
  "Satellite" : mapboxSatellite
};

var overlayMaps = {};

var layerControl = L.control.layers(baseMaps, overlayMaps, {'position':'bottomleft'}).addTo(newEventMap);

var marker;
var latlng = null;
newEventMap.on('click', function(e) {
    if(marker)
        newEventMap.removeLayer(marker);
    latlng = e.latlng; // e is an event object (MouseEvent in this case)
    marker = L.marker(e.latlng).addTo(newEventMap);
});

$('#createEvent').on('click', function (e) {

    if (latlng === null){
			$('#newEventModalTitle').html('<h4>Missing event location</h4>');
			$('#newEventModalContent').html('<p>Please select the epicenter of the event using the map.</p>')
			$('#newEventModal').modal('toggle');
    }
    else {
      var body = {
        "status": "active",
        "type": $('#selectType').val(),
        "created": new Date().toISOString(),
        "location": latlng,
        "metadata":{
          "user": "user@msf.org",
          "summary": $("#inputSummary").val(),
          "practical_details": $("#inputPracticals").val(),
          "security_details": $("#inputSecurity").val()
          }
        }

      $.ajax({
        type: "POST",
        url: "/api/events",
        data: JSON.stringify(body),
        contentType: 'application/json'
      }).done(function( data, textStatus, req ){
        var eventId = data.result.objects.output.geometries[0].properties.id;
        window.location.href = '/events/?eventId='+eventId;
      }).fail(function (reqm, textStatus, err){
				$('#newEventModalTitle').html('<h4>Error creating event</h4>');
				$('#newEventModalContent').html('<p>' + err +'.</p>')
				$('#newEventModal').modal('toggle');
      });
    }
})