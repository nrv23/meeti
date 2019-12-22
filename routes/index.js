const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const grupoController = require('../controllers/grupoController');
const MeetController = require('../controllers/MeetController');
const MeetControllerFrontend = require('../controllers/Frontend/MeetiController');
const usuariosControllerFrontend = require('../controllers/Frontend/UsuariosController');
const GruposControllerFrontend = require('../controllers/Frontend/GruposController');
const ComentariosControllerFrontend = require('../controllers/Frontend/ComentariosController');
const express = require('express');
const router = express.Router();

module.exports = () => {
	
	//AREA PUBLICA

	router.get('/',homeController.inicio);
	router.get('/crear-cuenta',usuariosController.formCrearCuenta);
	router.post('/crear-cuenta',usuariosController.validarPassword,usuariosController.crearCuenta);

	//inciar sesion
	router.get('/iniciar-sesion', authController.formIniciarSesion);
	router.post('/iniciar-sesion', authController.iniciarSesion);

	//confirmar cuenta 
	router.get('/confirmar-cuenta/:email',usuariosController.confrimarCuenta);

	//buscar por categoria
	router.get('/categoria/:slug',MeetControllerFrontend.FiltrarMeetis);

	//agregar comentarios 
	router.post('/meeti/:id', authController.validarSesion,
								ComentariosControllerFrontend.agregarComentario);

	//AREA PRIVADA

	//Administracion
	router.get('/admin',authController.validarSesion,adminController.panelAdmin);
	
	//Grupos
	router.get('/nuevo-grupo',authController.validarSesion,adminController.formNuevoGrupo);
	router.post('/nuevo-grupo',authController.validarSesion,
							   grupoController.subirImagen,
							   grupoController.nuevoGrupo);
	
	router.get('/editar-grupo/:grupoId',authController.validarSesion,adminController.formEditarGrupo);
	router.post('/editar-grupo/:grupoId',authController.validarSesion, grupoController.actualizarGrupo);
	router.get('/imagen-grupo/:grupoId', authController.validarSesion, adminController.formEditarImagen);
	router.post('/imagen-grupo/:grupoId', authController.validarSesion, 
							   			  grupoController.subirImagen,
										  grupoController.actualizarImagenGrupo);
	router.get('/grupos/:id', GruposControllerFrontend.mostrarinformacionGrupo);

	router.get('/eliminar-grupo/:grupoId',authController.validarSesion,adminController.formEliminarGrupo);
	router.post('/eliminar-grupo/:grupoId',authController.validarSesion,grupoController.eliminarGrupo);
	
	//Meeti's
	router.get('/nuevo-meeti', authController.validarSesion, adminController.formNuevoMeet);
	router.post('/nuevo-meeti', authController.validarSesion, MeetController.sanitizarMeeti,
		MeetController.nuevoMeet);

	router.get('/editar-meeti/:id', authController.validarSesion, adminController.formEditarMeeti);
	router.post('/editar-meeti/:id', authController.validarSesion,
									MeetController.sanitizarMeeti,
									MeetController.actualizarMeeti);
	
	router.get('/eliminar-meeti/:id', authController.validarSesion, adminController.formEliminarMeeti);
	router.post('/eliminar-meeti/:id', authController.validarSesion, MeetController.eliminarMeeti);
	
	//Perfil
	router.get('/editar-perfil', authController.validarSesion,usuariosController.formEditarPerfil);
	router.post('/editar-perfil', authController.validarSesion,usuariosController.actualizarPerfil);

	//contraseña
	router.get('/editar-password',authController.validarSesion, adminController.formEditarPassword);
	router.post('/editar-password',authController.validarSesion, usuariosController.actualizarPassword);
	
	//imagen del grupo
	router.get('/imagen-perfil',authController.validarSesion,adminController.formEditarImagenPerfil);
	router.post('/imagen-perfil',authController.validarSesion,
								usuariosController.subirImagen
								,usuariosController.editarImagenPerfil);
	//cerrar sesion
	router.get('/logout', authController.validarSesion,adminController.cerrarSesion);

	//mostrar meetis del frontend filtrados 
	router.get('/meeti/:id', MeetControllerFrontend.mostrarMeeti);

	//confirmar asistencia

	router.post('/confirmar-asistencia/:slug', MeetControllerFrontend.confirmarAsistencia);

	//muestra asistentes al meeti
	router.get('/meet/:slug', MeetControllerFrontend.mostrarAsistentes);
	
	//ver informacion del usuario administrador
	router.get('/usuarios/:id', usuariosControllerFrontend.mostrarInformacionUsuario);
	//retornar las rutas
	return router;
}


// cuando se visita una url por ejemplo /editar-producto/6, al cargar esa url si hay un formulario 
// que envia informacion por POST, no se necesita pasarle una url al formulario para enviar los datos
// porque automaticamente los envia a la misma url actual es decir /editar-producto/6, de manera que en 
// archivo router creo una url /editar-producto/:id para get y post