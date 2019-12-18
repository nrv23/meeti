document.addEventListener('DOMContentLoaded', () => {
	if(document.querySelector('#ubicacion-meeti')){
		cargarMapa();
	}
});

function cargarMapa(){

	const lat = document.getElementById('lat').value;
	const lng = document.getElementById('lng').value;
	const direccion = document.getElementById('direccion').value;

	const map = L.map('ubicacion-meeti').setView([parseFloat(lat), parseFloat(lng)], 15);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.marker([parseFloat(lat), parseFloat(lng)]).addTo(map)
	    .bindPopup(direccion)
	    .openPopup();

}