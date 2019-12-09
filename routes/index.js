const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const grupoController = require('../controllers/grupoController');
const MeetController = require('../controllers/MeetController');

module.exports = function(){
	
	router.get('/',homeController.inicio);
	router.get('/crear-cuenta',usuariosController.formCrearCuenta);
	router.post('/crear-cuenta',usuariosController.validarPassword,usuariosController.crearCuenta);

	//inciar sesion
	router.get('/iniciar-sesion', authController.formIniciarSesion);
	router.post('/iniciar-sesion', authController.iniciarSesion);

	//confirmar cuenta 
	router.get('/confirmar-cuenta/:email',usuariosController.confrimarCuenta);

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
	router.get('/eliminar-grupo/:grupoId',authController.validarSesion,adminController.formEliminarGrupo);
	router.post('/eliminar-grupo/:grupoId',authController.validarSesion,grupoController.eliminarGrupo);
	
	//Meeti's
	router.get('/nuevo-meeti', authController.validarSesion, adminController.formNuevoMeet);
	router.post('/nuevo-meeti', authController.validarSesion, MeetController.nuevoMeet);
	
	//retornar las rutas
	return router;
}


// cuando se visita una url por ejemplo /editar-producto/6, al cargar esa url si hay un formulario 
// que envia informacion por POST, no se necesita pasarle una url al formulario para enviar los datos
// porque automaticamente los envia a la misma url actual es decir /editar-producto/6, de manera que en 
// archivo router creo una url /editar-producto/:id para get y post