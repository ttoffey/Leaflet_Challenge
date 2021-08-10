var earthMap = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors',
    maxZoom: 3
}).addTo(earthMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(createMarkers);

function createMarkers(response) {

    magList = [];

    for (var i = 0; i < response.features.length; i++) {
        var location = response.features[i].geometry;
        console.log(location)

        var magnitudeData = response.features[i].properties;
        magnitude = magnitudeData.mag;
        var places = response.features[i].properties;
        var alerts = response.features[i].properties;
        // var times = response.features[i].properties;
        var depths = location.coordinates[2];
        console.log(depths);
    }
    function getColor(depths) {
        return depths > 90 ? '#800026' :
            depths > 70 ? '#BD0026' :
                depths > 50 ? '#E31A1C' :
                    depths > 30 ? '#FC4E2A' :
                        depths > 10 ? '#FD8D3C' :
                            depths < 10 ? '#FEB24C' :
                                '#FFEDA0';
    }
    
    function getMarkerSize(mag) {
        return Math.sqrt(mag) * 10;
    }

    createMarkers(depths,magnitude);
    var locationMarkers=[];
    function createMarkers(depth, magnitude) {
        
        var locationMarker = L.circleMarker([location.coordinates[1], location.coordinates[0]],
            {
                color: getColor(depth),
                opacity: 2,
                weight: 5,
                fillOpacity: 1,
                radius: getMarkerSize(magnitude)
            })
            .bindPopup("<h3> Place: " + places.place + "<h3> Magnitude: " + magnitude.mag +
                "<h3> Depth: " + depth + "</h3>");
        locationMarkers.push(locationMarker);

        // createMap(L.layerGroup(locationMarkers));
    }
}
