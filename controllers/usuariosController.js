const Usuarios = require('../models/Usuario');
const Handlers = require('../handlers/email');

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