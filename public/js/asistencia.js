import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {


	const asistencia = document.querySelector('#confirmar-asistencia');
	
	if(asistencia){

		asistencia.addEventListener('submit',confirmarAsistencia);
	}
});


function confirmarAsistencia(e){
	e.preventDefault();

	const btnAsistencia = document.querySelector('#confirmar-asistencia input[type="submit"]');
	let accion = document.querySelector('#accion').value;
	const mensaje = document.getElementById('mensaje');
	const data = {
		accion
	}

	axios.post(this.action,data)
		.then(data => {
			
			mensaje.innerHTML='';
			
			if(accion === 'confirmar'){
				document.querySelector('#accion').value= 'Cancelar';
				btnAsistencia.value= 'Cancelar';
				btnAsistencia.classList.remove('btn-azul');
				btnAsistencia.classList.add('btn-rojo');
				mensaje.innerHTML= data.data;
			}else{
				document.querySelector('#accion').value= 'confirmar';
				btnAsistencia.value= 'Sí';
				btnAsistencia.classList.remove('btn-rojo');
				btnAsistencia.classList.add('btn-azul');
				mensaje.innerHTML= data.data;
			}
		})

}