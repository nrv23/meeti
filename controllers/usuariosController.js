const Usuarios = require('../models/Usuario');
const Handlers = require('../handlers/email');
const bcrypt = require('bcrypt-nodejs');

exports.formCrearCuenta = (req, res) => {
	res.render('crear-cuenta',{
		nombrePagina : 'Crea tu Cuenta'
	});
}


exports.crearCuenta= async (req, res) => {

	const {nombre, email, password} = req.body;
	
	try {
		const nuevoUsuario = await Usuarios.create({nombre, email, password});
		//crear URL de confirmacion

		const url=`http://${req.headers.host}/confirmar-cuenta/${email}`;
		const usuario = {nombre, email, password};
		//enviar email de confirmacion de cuenta
		await Handlers.enviarEmail({
			usuario,
			url,
			subject : 'Confirma tu cuenta de Meeti',
			archivo: 'confirmar-cuenta' 
		});

		req.flash('exito','Hemos enviado un email, confirma tu cuenta');
		res.redirect('/iniciar-sesion');

	} catch(e) {

		console.log(e);
		const erroresSequelize = e.errors.map(err => err.message); // crear un array con los mensajes
		// de los errores generados

		req.flash('error', erroresSequelize);
		res.redirect('/crear-cuenta');

	}
}

//middleware para validar las contraseñas
exports.validarPassword = (req, res, next) => {

	const {password} = req.body;

	req.checkBody('confirmar', 'El campo de confirmar password no puede estar vacío').notEmpty();
	req.checkBody('confirmar', 'Las contraseñas no coinciden').equals(password);

	const errores = req.validationErrors();
	
	if(errores.length) {
		req.flash('error', errores.map(error => error.msg));
		return res.redirect('/crear-cuenta');
	}

	next();
}


exports.confrimarCuenta = async (req,res, next) => {
	
	const {email} = req.params;
	const usuario = await Usuarios.findOne({where:{email}});
	
	if(!usuario){
		req.flash('error', 'El correo no existe');
		res.redirect('/crear-cuenta');
		return next();
	}else{
		usuario.activo=1;
		usuario.save();

		req.flash('exito', 'Tu cuenta ha sido confirmada');
		return res.redirect('/iniciar-sesion');
	}
}

exports.formEditarPerfil = async (req,res) => {

	const {id}=req.user;
	const usuario = await Usuarios.findByPk(id);

	if(!usuario){
		req.flash('error', 'Operación no válida');
		res.redirect('/admin');
		return next();
	}

	res.render('editar-perfil',{
		nombrePagina: 'EDITAR PERFIL: '+usuario.nombre,
		usuario
	})
}


exports.actualizarPerfil = async (req, res) => {

	req.sanitizeBody('nombre');
	req.sanitizeBody('email');

	const {id} = req.user;
	const {nombre, descripcion, email} = req.body;
	const usuario = await Usuarios.findByPk(id);

	if(!usuario){

		req.flash('error', 'Operación no válida');
		return res.redirect('/admin');
	}

	try {
		usuario.nombre = nombre;
		usuario.email = email;
		usuario.descripcion = descripcion;
		await usuario.save();

		req.flash('exito', 'usuario actualizado');
		res.redirect('/admin');

	} catch(e) {
		// statements
		console.log(e);
		const erroresSequelize = e.errors.map(err => err.message); // crear un array con los mensajes
		// de los errores generados

		req.flash('error', erroresSequelize);
		res.redirect('/crear-cuenta');

	}
}

exports.actualizarPassword = async (req, res) => {

	//sanitizar las contraseñas

	req.sanitizeBody('password');
	req.sanitizeBody('nuevo_password');
	req.sanitizeBody('confirmar_password')

	try {
		console.log(req.body)
		const {id} = req.user;
		const {password, nuevo_password, confirmar_password} = req.body;
		const usuario =  await Usuarios.findByPk(id);
		console.log(nuevo_password)
		if(!usuario.comparePass(password)){
			req.flash('error', 'Contraseña Actual Incorrecta');
			return res.redirect('/editar-password');

		}else if(nuevo_password === '' || confirmar_password === ''){

			req.flash('error', 'Los campos para las contraseñas son requeridos');
			return res.redirect('/editar-password');

		}else if(nuevo_password.toString() != confirmar_password.toString()){

			req.flash('error', 'Las contraseñas no coinciden');
			return res.redirect('/editar-password');
		}
		//actualizar la contraseña 
		
		const hash = usuario.hashPassword(nuevo_password);
		usuario.password = hash; 
		
		await usuario.save();
		req.logout();
		req.flash('exito', 'Contraseña Actualizada. Inicia Sesión');
		res.redirect('/iniciar-sesion');
		
	} catch(e) {
		// statements
		console.log(e);
	}

}