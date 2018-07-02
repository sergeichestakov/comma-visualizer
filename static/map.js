mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2VpY2hlc3Rha292IiwiYSI6ImNqNGs2NzdxMzBnMWYyd3FqOWlxd2N1ZWkifQ.cVaGTeATJmDDq6ULte67MQ';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-122.25, 37.7], // starting position
    zoom: 8 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Create a GeoJSON source with an empty lineString.
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

let activeRoutes = [];

const drawRoute = (coordinates, tripNum) => {
    addFeature()

	// start by showing just the first coordinate
	geojson.features[tripNum - 1].geometry.coordinates = [coordinates[0]];

    const route = 'route' + tripNum
    activeRoutes.push(route);

    // zoom in to new route
    map.jumpTo({ 'center': coordinates[0], 'zoom': 11 });

	// add route to map
	map.addSource(route, { type: 'geojson', data: geojson });
	map.addLayer({
		"id": route,
		"type": "line",
		"source": route,
		"paint": {
			"line-color": "red",
			"line-opacity": 0.75,
			"line-width": 5
		}
	});

    // animate route rendering
	let index = 0
	const timer = setInterval(() => {
		if (index < coordinates.length) {
			geojson.features[tripNum - 1].geometry.coordinates.push(coordinates[index]);
			map.getSource(route).setData(geojson);
			index++;
		} else {
			clearInterval(timer)
		}
	}, 5)

}

// Add a new line to geoJson object
const addFeature = () => {
    geojson.features.push({
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                []
            ]
        }
 	});
}

const resetRoutes = () => {
    // delete all previous route drawings and reset
    activeRoutes.forEach(route => {
        map.removeLayer(route);
        map.removeSource(route);
    })

    geojson.features = [] //Clear previously drawn lines
    activeRoutes = [];
}
const processData = data => {
    const trips = data.trips;
    let tripNum = 0;
    console.log(trips)

    resetRoutes()

    trips.forEach(responseArray => {
        const trip = JSON.parse(responseArray[1]); //Returned as a list of [key, value], we only need value
        tripNum++;

        const start = trip.start_time;
        const end = trip.end_time;
        const coordsArray = trip.coords;

        let coords = []
        coordsArray.forEach(coord => {
            const lat = coord.lat;
            const lng = coord.lng;
            const speed = coord.speed;
            const dist = coord.dist;

            coords.push([lng, lat]);
        })
        drawRoute(coords, tripNum)
    });
}
