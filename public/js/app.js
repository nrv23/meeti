	import {OpenStreetMapProvider} from 'leaflet-geosearch';
	
	const lat = 9.9333296;
	const long= -84.0833282;
	const map = L.map('mapa').setView([lat, long], 15);
	//contenedor para markers
	let markers = new L.FeatureGroup().addTo(map);
	let marker;

	document.addEventListener("DOMContentLoaded", () => {
		// el tercer parametro es el zoom del mapa
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		//obtener el campode buscador

		const buscador = document.querySelector('#formbuscador');

		buscador.addEventListener("input", buscarDireccion);

	})

	function buscarDireccion(e) {
		//se va buscar cuando el valor del input sea mayor a 8 letras
		const tamano = e.target.value.length;	
		const valor = e.target.value;

		if(tamano > 8){

			//limpiar los markers anteriores

			markers.clearLayers();

			//utilizar el provider de openstreetmap


			const provider = new OpenStreetMapProvider(); // instanciar OpenStreetMapProvider

			provider.search({query: valor}).then(resultados => { //provider.search es la funcion para buscar lugares
				// el parametro search es para buscar por coincidencias
				map.setView(resultados[0].bounds[0], 15);

				//agregar los markers al mapa

					marker = new L.marker(resultados[0].bounds[0], {
						//habilitar la opcion para mover el pin
						draggable: true,
						autoPan: true // habilitar la opcion de mover el mapa cuando se mueva el marker
					})
					.addTo(map)
					.bindPopup(resultados[0].label)
					.openPopup();

					markers.addLayer(marker);

					//evento para mover el pin y obtener la informacion de la localizacion

					marker.on('moveend',function(e){//moveend es un evento que escucha el movimiento en la ultima 
						//posicion donde se localiza, es decir donde el marker se detenga

						marker= e.target;
						const posicion = marker.getLatLng();
						//habilitar opcion para centrar el mapa cuando se mueva el pin
						map.panTo(new L.LatLng(posicion.lat,posicion.lng));
					})
				
			})

		}
	}