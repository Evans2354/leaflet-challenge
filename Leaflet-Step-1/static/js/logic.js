// Create map
var myMap = L.map("map", {
  center: [40, -117.4179],
  zoom: 4.7
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 8,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
var geoData ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var geojson;

// Grab data 
d3.json(geoData, function(data) {
  geojson = L.choropleth(data, { 
     valueProperty: "mag",
     scale: ["#adff2f", "#ffa500"],
     steps: 10,
     mode: "q",
     style: {
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },
    
    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("location: " + feature.properties.place + "<br>Magniture: " + feature.properties.mag);
    },

  }).addTo(myMap);
  
  L.choropleth(data, { 
    
    pointToLayer: function (feature, latlng) {
      var colors = geojson.options.colors;
      var a =parseInt(feature.properties.mag)
      var b =parseInt(feature.properties.mag)
      //console.log(b);

      var geojsonMarkerOptions = {
        radius: feature.properties.mag*3,
        scale: ["#adff2f", "#ffa500"],
        fillColor: "#ffa500",
        scaleRadius: true,
        color: colors[a],
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
      };
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  }).addTo(myMap);;

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earth Quake Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});
