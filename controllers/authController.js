const passport = require('passport');

exports.formIniciarSesion = (req, res) => {
	res.render('iniciar-sesion',{
		nombrePagina : 'Iniciar sesión'
	});
}

exports.iniciarSesion = passport.authenticate('local',{
	successRedirect: '/admin',
	failureRedirect: '/iniciar-sesion',
	//habilitar mensajes de error usando connect-flash

	failureFlash: true,
	// si deja los campos vacios
	badRequestMessage: 'Todos los campos son requeridos'
});
//meeting 1 hora jueves 21 de noviembre


//revisar si el usuario esta logueado

exports.validarSesion = (req, res, next)=> {
	//passport me provee una funcion para saber si alguien esta logueado

	//req.isAuthenticated() me permite saber si hay una sesion habilitada

	if(!req.isAuthenticated()) return res.redirect('/iniciar-sesion');	
	
	return next();	
}