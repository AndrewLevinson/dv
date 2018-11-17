// an array for the magnitude
var magnitudes;
// an array for depth
var depths;
// an array for lat & long
var latitudes, longitudes;

// minimum and maximum values for magnitude and depth
var magnitudeMin, magnitudeMax;
var depthMin, depthMax;

// the dots we'll be adding to the map
var circles = [];

// table as the data set
var table;

// my leaflet.js map
var mymap;

function preload() {
  // load the CSV data into our `table` variable and clip out the header row
  table = loadTable("data/all_month.csv", "csv", "header");
}

function setup() {
  // first, call our map initialization function (look in the html's style tag to set its dimensions)
  setupMap();

  // next, draw our p5 diagram that complements it
  createCanvas(800, 600);
  background(222);

  fill(0);
  noStroke();
  textSize(16);
  text(`Plotting ${table.getRowCount()} seismic events`, 20, 40);
  text(`Largest Magnitude: ${getColumnMax("mag")}`, 20, 60);
  text(`Greatest Depth: ${getColumnMax("depth")}`, 20, 80);
}

function setupMap() {
  /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

  // create your own map
  mymap = L.map("quake-map").setView([51.505, -0.09], 3);

  // load a set of map tiles – choose from the different providers demoed here:
  // https://leaflet-extras.github.io/leaflet-providers/preview/
  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken:
        "pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA"
    }
  ).addTo(mymap);

  // call our function (defined below) that populates the maps with markers based on the table contents
  drawDataPoints();
}

function drawDataPoints() {
  strokeWeight(5);
  stroke(255, 0, 0);

  // get the two arrays of interest: depth and magnitude
  depths = table.getColumn("depth");
  magnitudes = table.getColumn("mag");
  latitudes = table.getColumn("latitude");
  longitudes = table.getColumn("longitude");

  // get minimum and maximum values for both
  magnitudeMin = 0.0;
  magnitudeMax = getColumnMax("mag");
  console.log("magnitude range:", [magnitudeMin, magnitudeMax]);

  depthMin = 0.0;
  depthMax = getColumnMax("depth");
  console.log("depth range:", [depthMin, depthMax]);

  // cycle through the parallel arrays and add a dot for each event
  for (var i = 0; i < depths.length; i++) {
    // create a new dot
    var circle = L.circle([latitudes[i], longitudes[i]], {
      color: "red", // the dot stroke color
      fillColor: "#f03", // the dot fill color
      fillOpacity: 0.25, // use some transparency so we can see overlaps
      radius: magnitudes[i] * 40000
    });

    // place it on the map
    circle.addTo(mymap);

    // save a reference to the circle for later
    circles.push(circle);
  }
}

function removeAllCircles() {
  // remove each circle from the map and empty our array of references
  circles.forEach(function(circle, i) {
    mymap.removeLayer(circle);
  });
  circles = [];
}

// get the maximum value within a column
function getColumnMax(columnName) {
  // get the array of strings in the specified column
  var colStrings = table.getColumn(columnName);

  // convert to a list of numbers by running each element through the `float` function
  var colValues = _.map(colStrings, float);

  // find the max value by manually stepping through the list and replacing `m` each time we
  // encounter a value larger than the biggest we've seen so far
  var m = 0.0;
  for (var i = 0; i < colValues.length; i++) {
    if (colValues[i] > m) {
      m = colValues[i];
    }
  }
  return m;

  // or do it the 'easy way' by using lodash:
  // return _.max(colValues);
}
