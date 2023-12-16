function moveToCoordinates() {
    var latitude = parseFloat(document.getElementById('latitude').value);
    var longitude = parseFloat(document.getElementById('longitude').value);

    if (!isNaN(latitude) && !isNaN(longitude)) {
        map.setView([latitude, longitude], 15);
    } else {
        alert("Please enter valid coordinates");
    }
}
var map = L.map('map', {
    center: [39.9854, 32.7192],
    zoom: 30
});

// Remove the attribution control
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '',
    attributionControl: false
}).addTo(map);

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
                color: '#3498db' 
            },
            drawError: {
                color: '#e74c3c', 
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


var searchControl = L.Control.geocoder().addTo(map);
document.getElementById('search-bar').appendChild(searchControl.getContainer());

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
    if (!isNaN(area)) {
        
        var panelDimensions = [
            { watts: 50, width: 60, height: 50 },
            { watts: 100, width: 100, height: 60 },
            { watts: 200, width: 150, height: 70 },
            { watts: 300, width: 165, height: 100 },
            { watts: 400, width: 200, height: 100 },
            { watts: 500, width: 225, height: 110 },
            { watts: 600, width: 245, height: 115 }
        ];

        
        var panelCounts = panelDimensions.map(function (panel) {
            var panelArea = (panel.width / 100) * (panel.height / 100) ; 
            var numberOfPanels = Math.floor(area / panelArea);
            return { watts: panel.watts, count: numberOfPanels };
        });

        
        var resultMessage = "Number of panels needed:\n";
        panelCounts.forEach(function (panel) {
            resultMessage += panel.watts + " W: " + panel.count + " panels\n";
        });

        alert(resultMessage);
    } else {
        alert("Please draw an area on the map first.");
    }
}