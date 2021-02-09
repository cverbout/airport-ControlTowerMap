var mymap = L.map('map', {
  center: [39.8283, -98.5795],
  zoom: 3,
  maxZoom: 10,
  minZoom: 3,
  detectRetina: true
});

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png').addTo(mymap);


var airports = null;

var colors = chroma.scale('Set1').mode('lch').colors(5);

for (i = 0; i < 2; i++) {
  $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

airports = L.geoJson.ajax("assets/airports.geojson", {

  onEachFeature: function(feature, layer) {
    layer.bindPopup(feature.properties.AIRPT_NAME);
    return feature.properties.AIRPT_NAME;
  },

  pointToLayer: function(feature, latlng) {
    var id = 0;
    if (feature.properties.CNTL_TWR == "N") {
      id = 0;
    } else if (feature.properties.CNTL_TWR == "Y") {
      id = 1;
    }
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'fa fa-plane marker-color-' + (id + 1).toString()
      })
    });
  },
  attribution: 'Airport data &copy; Data.Gov | State data &copy; Mike Bostock D3 | Made By Chase Verbout'
}).addTo(mymap);

colors = chroma.scale('Blues').colors(5);

function setColor(count) {
  var id = 0;
  if (count > 59) {
    id = 4;
  } else if (count > 26 && count <= 59) {
    id = 3;
  } else if (count > 15 && count <= 26) {
    id = 2;
  } else if (count > 8 && count <= 15) {
    id = 1;
  } else {
    id = 0;
  }
  return colors[id];
}

function style(feature) {
  return {
    fillColor: setColor(feature.properties.count),
    fillOpacity: 0.65,
    weight: 2,
    opacity: 1,
    color: '#b4b4b4',
    dashArray: '4'
  };
}

var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
  style: style,
}).addTo(mymap);

var legend = L.control({
  position: 'topright'
});

legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<b># of Airports per State</b><br />';
  div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 60+ </p>';
  div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 27-59 </p>';
  div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 16-26 </p>';
  div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 9-15 </p>';
  div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 1-8 </p>';
  div.innerHTML += '<hr><b>Air Traffic Control Tower<b><br />';
  div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> None </p>';
  div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> Present </p>';
  return div;
};

legend.addTo(mymap);

L.control.scale({position: 'bottomleft'}).addTo(mymap);
