const Usuarios = require('../models/Usuario');
const Handlers = require('../handlers/email');
const bcrypt = require('bcrypt-nodejs');
const multer = require('multer'); // subir imagenes al servidor
const helper = require('../helpers/helper');
const fs = require('fs'); // file- system
//configuracion de multer

const configMulter = {
	limits: { fileSize: 100000},//limitar tamaño de imagen a 100 kb
	storage: fileStorage= multer.diskStorage({
		destination: (req, file, next) => { // donde se va subir la imagen
			next(null, __dirname+'/../public/uploads/usuarios/')
		},
		filename: (req, file, next) => {
			const ext = file.mimetype.split('/')[1]; // obtener tipo de archivo

			next(null, `${helper.getID()}.${ext}`);
		}
	}),
	//filtrar formatos de imagen
	fileFilter: (req, file, next) => {

		const ext = file.mimetype.split('/')[1]; //
		if(ext === 'jpeg' || ext === 'png' ){
			next(null, true); // el archivo se acepta
		}else{
			next(new Error('Formato no válido'), false);
		}
	} 
}	

const upload = multer(configMulter).single('imagen');
//.single porque solo se va subir una cosa a la vez y el texto imagen porque es el name 
// del campo html donde viene la imagen


exports.subirImagen= (req,res, next) => {
	upload(req, res, function(error){
	
		if(error){
			if(error instanceof multer.MulterError){ // si el error es una instancia de MulterError
				if(error.code === 'LIMIT_FILE_SIZE'){
					req.flash('error', 'El tamaño es demasiado grande. Máximo 100KB');
				}else{
					req.flash('error', error.message);
				}
			}else if(error.hasOwnProperty('message')){ // si el objeto error contiene la propiedad
				//message.
				req.flash('error', error.message);
			}

			res.redirect('back');
			return;
		}else{
			next();
		}

	})
}

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

//editar la imagen del grupo y eliminar la anterior

exports.editarImagenPerfil = async (req, res) => {

	const {id} = req.user; // el request guarda la instancia del usuario logueado, este id es el usuario 
	// que creó el grupo
	const usuario = await Usuarios.findByPk(id);

	if(!usuario){
		
		req.flash('error','Operación no válida');
		return res.redirect('/admin');
	}

	//verificar que exista una imagen anterior y venga una nueva imagen cargada

	if(req.file && usuario.imagen) {
		const imagenAnteriorRuta= __dirname+'/../public/uploads/usuarios/'+usuario.imagen;
		//eliminar la imagen
		
		fs.unlink(imagenAnteriorRuta,(err) => {
			if(err){
				console.log(err);
			}

			return;
		});
	}

	if(req.file){//si cargó una imagen, la actualiza 
		usuario.imagen = req.file.filename;
	}

	await usuario.save();

	req.flash('exito','Imagen actualizada');
	res.redirect('/admin');
}
