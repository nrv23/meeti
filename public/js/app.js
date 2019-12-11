	import {OpenStreetMapProvider} from 'leaflet-geosearch';
	
	const geocodeService = L.esri.Geocoding.geocodeService(); //instancia del servicio de geocoding 
	const lat = document.getElementById("lat").value || 9.9333296;
	const lng = document.getElementById("lng").value || -84.0833282;
	const direccion = document.getElementById("direccion").value || '';

	    /*if (navigator.geolocation) { //check if geolocation is available
            navigator.geolocation.getCurrentPosition(function(position){
                 const lat = position.coords.latitude;
                 const lng = position.coords.longitude;
    			console.log(lat);
                                console.log(lng;
        	});   
       	}*/
	
	//contenedor para markers
	const map = L.map('mapa').setView([lat, lng], 15);
	let markers = new L.FeatureGroup().addTo(map);
	let marker;

	//colocar el pin en edicion
	if(lat && lng){// si estos valores existen
		marker = new L.marker([lat,lng], {
					//habilitar la opcion para mover el pin
					draggable: true,
					autoPan: true // habilitar la opcion de mover el mapa cuando se mueva el marker
				})
				.addTo(map)
				.bindPopup(direccion)
				.openPopup();

				markers.addLayer(marker);

				marker.on('moveend',function(e){//moveend es un evento que escucha el movimiento en la ultima 
						//posicion donde se localiza, es decir donde el marker se detenga
						marker= e.target;
						const posicion = marker.getLatLng();
						//habilitar opcion para centrar el mapa cuando se mueva el pin
						map.panTo(new L.LatLng(posicion.lat,posicion.lng));
						//reverse geocoding cuando el usuario reubica el pin

						geocodeService.reverse().latlng(posicion,15).run(function(error, data){
							//cambiar la descripcion del popup del marker en cada reubicacion del pin

							marker.bindPopup(data.address.LongLabel);

							cargarData(data);
					
						});
					});
	}

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

			//utilizar el provider de openstreetmap y el geoCoder

			const provider = new OpenStreetMapProvider(); // instanciar OpenStreetMapProvider

			provider.search({query: valor}).then(resultados => { //provider.search es la funcion para buscar lugares
				// el parametro search es para buscar por coincidencias

				//el servicio de geocoding basicamente lo que hace es que al pasarle una ubicacion aplica un reverse
				// que obtiene datos del lugar al que pertenece la ubicacion
				geocodeService.reverse().latlng(resultados[0].bounds[0],15).run(function(error, result){
					//.run va ejecutar la busqueda
					cargarData(result);

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
						//reverse geocoding cuando el usuario reubica el pin

						geocodeService.reverse().latlng(posicion,15).run(function(error, data){
							//cambiar la descripcion del popup del marker en cada reubicacion del pin

							marker.bindPopup(data.address.LongLabel);

							cargarData(data);
					
						});
					})
				})
			})
		}
	}

	function cargarData(resultado){
		
		document.getElementById("direccion").value = resultado.address.Address || '';
		document.getElementById("ciudad").value = resultado.address.City || '';
		document.getElementById("estado").value = resultado.address.Region || '';
		document.getElementById("pais").value = resultado.address.CountryCode || '';
		document.getElementById("lat").value = resultado.latlng.lat || '';
		document.getElementById("lng").value = resultado.latlng.lng || '';
	}



