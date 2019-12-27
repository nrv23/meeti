import Swal from 'sweetalert2';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {

	const formEliminar = document.querySelectorAll('.eliminar-comentario');

	//validar que existe algun boton de eliminar

	if(formEliminar.length > 0){

		formEliminar.forEach(form => {
			//agregar evento submit a cada form

			form.addEventListener("submit", eliminarComentario);
		});
	}
})


function eliminarComentario(e){
	e.preventDefault();
	// esta funcion esta dentro de un foreach que itera forms donde hay un boton de eliminar 
	// al usar el this, hace referencia a una instancia de formulario iterado en el foreach por lo
	//tanto puedo acceder a las propiedades y funciones del formulario
	const action = this.action;
	
		Swal.fire({
		  title: 'Está seguro?',
		  text: 'Si borra un comentario no podrá recuperarlo',
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Borrar',
		  cancelButtonText: 'Cancelar'
		}).then((result) => {
		  	if (result.value) {

		  		//tomar el id del comentario
		  		const idComentario= this[0].value;
		  		//crear el objeto
		  		const datos = {
		  			idComentario
		  		}

			  	axios.post(action, datos).then(resultado => {
			  		
					if(resultado.status == 200){
						this.parentElement.parentElement.remove();
						Swal.fire('Eliminar!',resultado.data ,'success')
					}
					
				}).catch(err => {

				 	//manejo de errores en el catch
				 	if(err.response.status === 403 || err.response.status === 404){
				 		Swal.fire('Eliminar!',err.response.data,'error');
				 	}
				 	
				})	
		    }  
		})
}