var map;
var infowindow;
var markers = [];
var service;

function initMap() {
    var pyrmont = {lat: -33.867, lng: 151.195};

    map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    setNearbySearch(pyrmont, service);
//
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
          if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(15);  // Why 17? Because it looks good.
            }

      setNearbySearch(map.getCenter());
    });

    map.addListener('dragend', function() {
        setNearbySearch(map.getCenter());
    });

    map.addListener('zoom_changed', function() {
        var zoom = map.getZoom();
        if (zoom < 11) {
            deleteMarkers();
        } else {
            setNearbySearch(map.getCenter());
        }
    });
}

function setNearbySearch(latlng) {
  deleteMarkersOutOfViewport();
  service.nearbySearch({
      location: latlng,
      radius: 1500,
      type: ['gym'],
    }, callback);
}

function callback(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var numberOfGymsInVicinity = 0;
      for (var i = 0; i < results.length; i++) {
        numberOfGymsInVicinity++;
        createMarker(results[i]);
      }
      console.log(numberOfGymsInVicinity)
      if (pagination.hasNextPage) {
          pagination.nextPage();
      }
    }
}

function createMarker(place) {
    console.log(place.name);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      optimized: false
    });
    markers.push(marker);

    google.maps.event.addListener(marker, 'mousedown', function() {
        var request = { reference: place.reference };
        service.getDetails(request, function(details, status) {
          infowindow.setContent(
          '<div>Company Name: '+details.name+'</div>'+
          '<div>Address: '+details.formatted_address+'</div>'+
          '<div>Phone: '+details.formatted_phone_number+'</div>'+
          '<div><img src="'+details.icon+'"/></div>'+
          '<div>Hours:</div>'+printOpeningHours(details.opening_hours)+
          '<div>Rating: '+checkIfUndefined(details.rating)+'</div>'+
          '<div>'+details.reviews+'</div>');
          infowindow.open(map, marker);
        });
    });
}

function printOpeningHours(openingHours) {
  if (undefined != openingHours && undefined != openingHours.weekday_text) {
    return '<div>'+openingHours.weekday_text[0]+'</div>'+
      '<div>'+openingHours.weekday_text[1]+'</div>'+
      '<div>'+openingHours.weekday_text[2]+'</div>'+
      '<div>'+openingHours.weekday_text[3]+'</div>'+
      '<div>'+openingHours.weekday_text[4]+'</div>'+
      '<div>'+openingHours.weekday_text[5]+'</div>'+
      '<div>'+openingHours.weekday_text[6]+'</div>';
  } else {
      return "";
  }
}

function checkIfUndefined(value) {
    if (undefined != value) {
        return value;
    }
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function deleteMarkersOutOfViewport() {
    console.log(markers.length);
    for (var i = 0; i < markers.length; i++) {
        if (!map.getBounds().contains(markers[i].getPosition())) {
            markers[i].setMap(null);
        }
    }
    console.log(markers.length);
}

function clearMarkers() {
    setMapOnAll(null);
}