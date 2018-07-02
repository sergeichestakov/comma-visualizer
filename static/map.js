mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2VpY2hlc3Rha292IiwiYSI6ImNqNGs2NzdxMzBnMWYyd3FqOWlxd2N1ZWkifQ.cVaGTeATJmDDq6ULte67MQ';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-122.25, 37.7], // starting position
    zoom: 8 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

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

/* Helper functions to process json response and animate map */

const processData = data => {
    const trips = data.trips;
    trips.forEach(array => {
        const trip = JSON.parse(array[1]); //Returned as a list of [key, value], we only need value

        const start = trip.start_time;
        const end = trip.end_time;
        const coords = trip.coords;

    });
}
