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
            icon: new L.DivIcon({
            iconSize: new L.Point(5, 5),
            className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
    }),
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

function handleSlopeChange() {
    var slopeSelect = document.getElementById('slope-roof');
    var selectedValue = slopeSelect.value;

    // Check if the selected value is "dont-know"
    if (selectedValue === 'dont-know') {
        // Create an input element
        var inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = 'Enter slope value';

        // Append the input element to the search-bar div
        document.getElementById('search-bar').appendChild(inputElement);
    } else {
        // Remove any existing input element
        var existingInput = document.querySelector('#search-bar input');
        if (existingInput) {
            existingInput.remove();
        }
    }
}

function calculatePanels() {
    // Your existing calculatePanels function logic
    // ...
}
function handleSlopeChange() {
    var select = document.getElementById("slope-roof");
    var selectedValue = select.options[select.selectedIndex].text;
    var selectedValueDiv = document.getElementById("selected-value");
    selectedValueDiv.textContent = "Selected Slope: " + selectedValue;

    // Show or hide the input box based on the selected value
    var inputBoxContainer = document.getElementById("input-box-container");
    inputBoxContainer.style.display = (selectedValue === "If you are not sure") ? "block" : "none";
}

