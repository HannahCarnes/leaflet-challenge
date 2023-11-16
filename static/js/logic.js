// get the url
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// color based on depth
function getColor(depth) {
  return depth > 90
    ? "#d73027"
    : depth > 70
    ? "#4575b4"
    : depth > 50
    ? "#91bfdb"
    : depth > 30
    ? "#313695"
    : "#74add1";
}

// map time
let myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 5,
});

// tile layer to get the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(myMap);

let earthQuakesMarkers = [];

// map features functionis
function createFeatures(earthquakeData) {
  for (let i = 0; i < earthquakeData.length; i++) {
    let earthquake = earthquakeData[i];

    // making marker adjust for size of quake
    let markerSize = earthquake.properties.mag * 10000; 

    // making color depend on depth
    let markerColor = getColor(earthquake.geometry.coordinates[2]);

    // circle marker
    let quakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      radius: markerSize,
      fillColor: markerColor,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    }).bindPopup(`<h3>${earthquake.properties.place}</h3><hr><p>Magnitude: ${earthquake.properties.mag}<br>Depth: ${earthquake.geometry.coordinates[2]}</p>`);

    earthQuakesMarkers.push(quakeMarker);
    quakeMarker.addTo(myMap);
  }

  // legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [0, 30, 50, 70, 90];
    let labels = [];

    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
  };
  legend.addTo(myMap);
}

// call the data 
d3.json(geoData).then(function (data) {
  createFeatures(data.features);
});




  
  