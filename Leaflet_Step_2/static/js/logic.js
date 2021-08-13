var usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Layer Group for geoJSON Dataset
var earthquakes = new L.LayerGroup()
var plates = new L.LayerGroup();

// Tile Layers (base maps)
var earthMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'
});


var grayscaleMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
    

var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var stamenTonerMap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
// BaseMap Object for BaseLayers
var baseMaps = {
    "Earth Map": earthMap,
    "<span style='color: #7B7B7B'>GrayScale Map</span>": grayscaleMap,
    "Outdoors Map": topoMap,
    "Stamen Toner Map": stamenTonerMap
};

// Overlay Object for Overlay Layers (geoJSON)
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": plates
};


var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3,
    layers: [earthMap, earthquakes]
});

// L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
// }).addTo(myMap);
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Retrieve Data


d3.json(usgsURL).then(function (response) {
    console.log(response);

    for (var i = 0; i < response.length; i++) {
        console.log(response[i])
    };

    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude = Math.sqrt(magnitude) * 10;
    };

    function styleInfo(features) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(features.geometry.coordinates[2]),
            color: "#000000",
            radius: markerSize(features.properties.mag),
            stroke: true,
            weight: 0.3
        }
    };

    function getColor(depth) {
        return depth > 90 ? '#800026' :
            depth > 70 ? '#BD0026' :
                depth > 50 ? '#E31A1C' :
                    depth > 30 ? '#FC4E2A' :
                        depth > 10 ? '#FD8D3C' :
                            depth < 10 ? '#FEB24C' :
                                '#FFEDA0';

    };


    L.geoJSON(response, {
        pointToLayer: function (features, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function (features, layer) {
            layer.bindPopup(`<h3>Place: ${features.properties.place}</h3><hr><p>Date: ${new Date(features.properties.time)}</p><p>Magnitude: ${features.properties.mag}</p>
                 <p>Depth: ${features.geometry.coordinates[2]}</p>`);
        }
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);
   

   
    d3.json(tectonicURL).then(function (data) {
        // console.log(response);
        L.geoJSON(data, {
            color: "#3D3D3D",
            weight: 2
        }).addTo(plates);
        plates.addTo(myMap)
        
        
    });
    

var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    depths = [0, 10, 30, 50, 70, 90];
    var labels = [];
   

    for (var i = 0; i < depths.length; i++) {

        div.innerHTML +=

            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
           
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' ' + '<br>' : '+');
    }
    // div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(myMap);
});

