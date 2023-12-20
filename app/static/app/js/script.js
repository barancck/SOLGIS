var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        attributionControl: false
    });

var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Â© OpenStreetMap contributors'
});

var map = L.map('map', {
center: [39.86550970762486, 32.73379759178506],
zoom: 20,
layers: [satelliteLayer] 
});

var baseMaps = {
"Satellite": satelliteLayer,
"Street": streetLayer
};

L.control.layers(baseMaps).addTo(map);
map.editable = new L.Editable(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        remove: true,
        edit: false
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
                color: 'red' 
            },
            drawError: {
                color: 'red', 
                timeout: 1000
            }
        },
        marker: false,
        circle: false,
        polyline: false,
        rectangle: false
    }
});
map.addControl(drawControl);


var searchControl = L.Control.geocoder({
defaultMarkGeocode: false
}).addTo(map);

// Attach the geocoder container to the 'search-bar' div
var searchContainer = document.getElementById('search-bar');
searchContainer.appendChild(searchControl.getContainer());

// Add an event listener to update suggestions dynamically
searchControl.on('geocoder_suggestion', function (event) {
var suggestion = event.suggestion.name;
// Do something with the suggestion (e.g., update UI)
console.log('Suggestion:', suggestion);
});

document.getElementById('area-value').textContent = '0';
map.on('draw:created', function (e) {
    var layer = e.layer;
    drawnItems.clearLayers();
    drawnItems.addLayer(layer);
    updateAreaDisplay(layer);
});

function updateAreaDisplay(layer) {
    if (layer instanceof L.Polygon) {
        var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        document.getElementById('area-value').textContent = area.toFixed(2);
    }
}
function calculatePanels() {
    var area = parseFloat(document.getElementById('area-value').textContent);
    var resultDiv = document.getElementById('calculation-results');
    
    if (!isNaN(area)) {
        var panelDimensions = [
            { watts: 400, width: 200, height: 100 },
            { watts: 500, width: 225, height: 110 },
            { watts: 600, width: 245, height: 115 }
        ];

        var panelCounts = panelDimensions.map(function (panel) {
            var panelArea = (panel.width / 100) * (panel.height / 100); 
            var numberOfPanels = Math.floor((area / 2) / panelArea);
            var Energy = Math.floor(numberOfPanels * panel.watts / 1000 * 7 );
            return { watts: panel.watts, count: numberOfPanels, total: Energy};
        });
        

        resultDiv.innerHTML = "<p><strong>Number of panels :</strong></p>";
        panelCounts.forEach(function (panel) {
            resultDiv.innerHTML += "<p>" + panel.watts + " W: " + panel.count + " panels</p>" + panel.total + " Kw Energy per day";
        });
    } else {
        resultDiv.innerHTML = "<p>Please draw an area on the map first.</p>";
    }
}