mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2VpY2hlc3Rha292IiwiYSI6ImNqNGs2NzdxMzBnMWYyd3FqOWlxd2N1ZWkifQ.cVaGTeATJmDDq6ULte67MQ';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-122.25, 37.7], // starting position
    zoom: 8 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Initialize a GeoJSON source object
let geojson = {
    "type": "FeatureCollection",
    "features": []
}

/* Event listener for form submission that sends post request of inputted date for processing in Flask server */

const form = document.getElementById('form');

form.addEventListener('submit', e => {
    e.preventDefault();
    const dateInput = document.getElementById('date');
    const date = dateInput.value;

    if(date){ //Send request to server
        const [year, month, day] = date.split('-');
        const body = year + month + day;
		fetch('/process', {
            method: 'POST',
            body: JSON.stringify({date: body}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.ok){
                res.json().then(data => processData(data))
            }
        });
    }

    dateInput.value = ''; // Reset input field

}, false);

/* Parse json response and animate map */

const SOURCE = 'trips'

const updateLayer = () => {
    geojson.features = []

    /* Remove previously rendered points */
    if(map.getLayer(SOURCE)){
        map.removeLayer(SOURCE)
        map.removeSource(SOURCE)
    }

    /* Add new source and layer */
    map.addSource(SOURCE, { type: 'geojson', data: geojson });
    map.addLayer({
		"id": SOURCE,
		"type": "circle",
		"source": SOURCE,
		"paint": {
            "circle-radius": 5,
            "circle-opacity": 1,
            "circle-color": {
                property: "speed",
                stops: [
                    [0, "red"],
                    [25, "yellow"],
                    [40, "green"],
                    [70, "darkgreen"],
                ]
            }
		}
	});
}

// Click event handler to generate popup with information on selected point
map.on('click', e => {
	const features = map.queryRenderedFeatures(e.point, { layers: [SOURCE] });

	// if the features have no info, return nothing
	if (!features.length) {
		return;
	}

	const feature = features[0];

	// Populate the popup and set its coordinates
	const popup = new mapboxgl.Popup()
	.setLngLat(feature.geometry.coordinates)
	.setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'> <h2> Details: </h2>' +
	'<ul class=\'list-group\'>' +
	'<li class=\'list-group-item\'> Speed: ' + feature.properties['speed'].toFixed(2) + ' mph' + ' </li>' +
    '<li class=\'list-group-item\'> Distance traveled: ' + feature.properties['dist'].toFixed(2) + ' miles' + ' </li>' +
    '<li class=\'list-group-item\'> Start Time: ' + feature.properties['start'] + ' </li>' +
    '<li class=\'list-group-item\'> End Time: ' + feature.properties['end'] + ' </li>' +
	'</ul></div>')
	.addTo(map);
});

const addPoint = (lng, lat, speed, dist, start, end) => {
    geojson.features.push({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lng, lat]
        },
        "properties": {
            "speed": speed,
            "dist": dist,
            "start": start,
            "end": end,
        }
    });
}

const getTime = date => {
    return date.substr(date.indexOf('T') + 1)
}

const processData = data => {
    const trips = data.trips;
    console.log(trips)

    updateLayer() // Reset the map

    trips.forEach(responseArray => {
        const trip = JSON.parse(responseArray[1]); //Returned as a list of [key, value], we only need value

        const start = trip.start_time;
        const end = trip.end_time;
        const coordsArray = trip.coords;

        coordsArray.forEach(coord => {
            const lat = coord.lat;
            const lng = coord.lng;
            const speed = coord.speed;
            const dist = coord.dist;

            addPoint(lng, lat, speed, dist, getTime(start), getTime(end))
        })
        // Draw all the points in that trip
        map.getSource(SOURCE).setData(geojson)
    });
}
