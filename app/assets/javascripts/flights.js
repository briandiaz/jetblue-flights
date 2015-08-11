
function addPolyline(latLng, lineSymbol) {
    return new google.maps.Polyline({
        path: latLng,
        strokeWeight: 2,
        strokeColor: '#ffc40d',
        geodesic: true,
        icons: [{
            icon: lineSymbol,
            offset: '100%',
            repeat: '30px'
        }]
    });
}

function createImageMarker(url, leg){
  var image = {
    url: url,
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(16,32)
  };
  return image;
}

function createLegMarker(leg, map){
    departure_marker = new google.maps.Marker({
        position: leg.departure.coordinates,
        map: map,
        animation: google.maps.Animation.DROP,
        title: leg.display_text,
        icon: createImageMarker("http://i.imgur.com/1jYzN2l.png")
    });
    arrival_marker = new google.maps.Marker({
        position: leg.arrival.coordinates,
        map: map,
        animation: google.maps.Animation.DROP,
        title: leg.display_text,
        icon: createImageMarker("http://i.imgur.com/1jYzN2l.png")
    });
    current_location_marker = new google.maps.Marker({
        position: leg.current_location.coordinates,
        map: map,
        animation: google.maps.Animation.DROP,
        title: leg.display_text,
        icon: createImageMarker(setAirplaneImage(bearing(leg.departure.coordinates, leg.arrival.coordinates)))
    });
    return [departure_marker, arrival_marker, current_location_marker];
}

function setAirplaneImage(angle){
    
    var imagePath = "";
    
    if(angle >= 0 && angle <= 45){
        imagePath = "http://i.imgur.com/o4gDhwv.png";
    }
    else if(angle >= 45 && angle <= 90){
        imagePath = "http://i.imgur.com/Dpg30es.png";
    }
    else if(angle >= 91 && angle <= 135){
        imagePath = "http://i.imgur.com/rPqWd63.png";
    }
    else if(angle >= 136 && angle <= 180){
        imagePath = "http://i.imgur.com/12Mywzq.png";
    }
    else if(angle >= 181 && angle <= 225){
        imagePath = "http://i.imgur.com/cvfzOzR.png";
    }
    else if(angle >= 226 && angle <= 270){
        imagePath = "http://i.imgur.com/SI2jnaL.png";
    }
    else if(angle >= 271 && angle <= 315){
        imagePath = "http://i.imgur.com/gExcxvI.png";
    }
    else{
        imagePath = "http://i.imgur.com/o4gDhwv.png";
    }
    console.log(imagePath);
    return "../"+imagePath;
}

function radians(n) {
  return n * (Math.PI / 180);
}

function degrees(n) {
  return n * (180 / Math.PI);
}

function bearing(from, to) {
    
    var lat1 = radians(from.lat());
    var lng1 = radians(from.lng());
    var lat2 = radians(to.lat());
    var lng2 = radians(to.lng());
    var dLon = (lng2-lng1);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = this.to_degree(Math.atan2(y, x));
    return 360 - ((brng + 360) % 360);
}

 function to_radians(deg) {
     return deg * Math.PI / 180;
}

 function to_degree(rad) {
    return rad * 180 / Math.PI;
}
function animate(flightsLatLng) {
    var count = 0;
    offsetId = window.setInterval(function() {
        count = (count + 1) % 2000;
        for (var i = 0; i < flightsLatLng.length; i++) {

            var icons = flightsLatLng[i].get('icons');
            icons[0].offset = (count / 2) + '%';
            flightsLatLng[i].set('icons', icons);

        }
    }, 200);
}


function initialize() {
    var mapOptions = {
        zoom: 4,
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };

    var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
    };

    var infowindows = [];
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var flightsPath;
    var latlngbounds = new google.maps.LatLngBounds();

    var flightsLatLng = []
    var current_key;
    var current_markers = [];
    for (var i = 0; i < flights.length; i++) {

        for (var j = 0; j < flights[i].length; j++) {
            
            current_markers = createLegMarker(flights[i][j], map);
            
            latlngbounds.extend(flights[i][j].departure.coordinates);
            
            latlngbounds.extend(flights[i][j].arrival.coordinates);
            
            latlngbounds.extend(flights[i][j].current_location.coordinates);
            
            currentflightLeg = [flights[i][j].departure.coordinates, flights[i][j].current_location.coordinates];
            
            flightsPath = addPolyline(currentflightLeg, lineSymbol);
            
            flightsPath.setMap(map);
            
            flightsLatLng.push(flightsPath);
            
            
        }

    }
    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds);

    animate(flightsLatLng);
    google.maps.event.trigger(map, 'resize');
    
}


function set_airport_code(object){
    var currentValue = object.val();
    var airport = "";
    if(currentValue.indexOf("|") > -1){
        airport = currentValue.split("|")[1].trim();
        object.val(airport);
    }
}

$(document).ready(function(){
    
    $(".airport_code").keyup(function(e){
        set_airport_code($(this));
    });
    
    $("#airport_list").change(function(e){
        set_airport_code($(this));
    }); 
    
    $(".airport_code").focusout(function(e){
        set_airport_code($(this));
    }); 
});