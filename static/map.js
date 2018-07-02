mapboxgl.accessToken = 'pk.eyJ1Ijoic2VyZ2VpY2hlc3Rha292IiwiYSI6ImNqNGs2NzdxMzBnMWYyd3FqOWlxd2N1ZWkifQ.cVaGTeATJmDDq6ULte67MQ';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-122.25, 37.7], // starting position
    zoom: 8 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

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
        }).then(res => console.log(res));
    }

    dateInput.value = ''; // Reset

}, false);
