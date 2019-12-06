const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const grupoController = require('../controllers/grupoController');

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
	
	router.get('/editar-grupo/:grupoId',authController.validarSesion,adminController.formEditarGrupo)
	
	//retornar las rutas
	return router;
}