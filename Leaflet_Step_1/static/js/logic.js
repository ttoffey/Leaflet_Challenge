var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(features, layer) {
        layer.bindPopup(`<h3>Place: ${features.properties.place}</h3><p>Date: ${new Date(features.properties.time)}</p><p>Magnitude: ${features.properties.mag}</p>
        <p>Depth: ${features.geometry.coordinates[2]}</p>`);
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
}
function createMap(earthquakes) {
    var earth = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
    })
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

    });
    var baseMaps = {
    "Earth Map": earth, 
    "Topographic Map": topo
};

var overlayMaps = {
    "Significant Earthquakes": earthquakes
};

var myMap = L.map("map", {
    // center: [37.7749, -122.4194],
    center: [0, 0],
    zoom: 5,
    layers: [earth, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap)
}


// // var legend = L.control({ position: 'bottomright' });
// // legend.onAdd = function (map) {

// //     var div = L.DomUtil.create('div', 'info legend');
// //     var labels = [],
// //         var categories = [];

// //     for (var i = 0; i < categories.length; i++) {

// //         div.innerHTML +=
// //             labels.push(
// //                 '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
// //                 // '<i class="circle" style="background:' + categories[i] + '"></i> ' +
// //                 (categories[i] ? categories[i] : '+'));

// //     }
// //     div.innerHTML = labels.join('<br>');
// //     return div;
// };
// legend.addTo(myMap);


// function createMarkers(response) {
//     console.log(response);
//     var locationMarkers = [];
//     for (var i = 0; i < response.features.length; i++) {
//         console.log(response.features[i].geometry.coordinates[1]);


//         var magnitude = response.features[i].properties;
//         var places = response.features[i].properties;

//         var times = response.features[i].properties;
//         var depth = response.features[i].geometry.coordinates[2];

//         // var locationMarker = L.marker([location.coordinates[1], location.coordinates[0]]); //bind popup
//         var locationMarker = L.circleMarker([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]],
//             {
//                 color: getColor(response.features[i].geometry.coordinates[2]),
//                 opacity: 1,
//                 weight: 2,
//                 fillOpacity: 1,
//                 radius: markerSize(response.features[i].properties.mag)

//             })
//             .bindPopup("<h3> Place: " + places.place + "<h3> Date: " + times.time + "<h3> Magnitude: " + magnitude.mag +
//                 "<h3> Depth: " + depth + "</h3>");
//         locationMarkers.push(locationMarker);

//     }

//     function markerSize(mag) {
//         return Math.sqrt(mag) * 10;
//     }
//     function getColor(depth) {
//         return depth > 90 ? '#800026' :
//             depth > 70 ? '#BD0026' :
//                 depth > 50 ? '#E31A1C' :
//                     depth > 30 ? '#FC4E2A' :
//                         depth > 10 ? '#FD8D3C' :
//                             depth < 10 ? '#FEB24C' :
//                                 '#FFEDA0';
//     }


//     createMap(L.layerGroup(locationMarkers));

// }


// // var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// d3.json(url).then(createMarkers);
