const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
	
	router.get('/',homeController.inicio);
	router.get('/crear-cuenta',usuariosController.formCrearCuenta);
	router.post('/crear-cuenta',usuariosController.validarPassword,
		usuariosController.crearCuenta);

	//inciar sesion

	router.get('/iniciar-sesion', authController.formIniciarSesion);

	return router;
}