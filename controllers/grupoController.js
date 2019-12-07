const Grupos = require('../models/Grupo'); 
const multer = require('multer'); // subir imagenes al servidor
const helper = require('../helpers/helper');
const fs = require('fs'); // file- system
//configuracion de multer

const configMulter = {
	limits: { fileSize: 100000},//limitar tamaño de imagen a 100 kb
	storage: fileStorage= multer.diskStorage({
		destination: (req, file, next) => { // donde se va subir la imagen
			next(null, __dirname+'/../public/uploads/grupos/')
		},
		filename: (req, file, next) => {
			const ext = file.mimetype.split('/')[1]; // obtener tipo de archivo

			next(null, `${helper.getID()}.${ext}`);
		}
	}),
	//filtrar formatos de imagen
	fileFilter: (req, file, next) => {
		const ext = file.mimetype.split('/')[1];
		console.log(file.mimetype)
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

exports.nuevoGrupo = async (req, res) => {

	//sanitizar los campos

	req.sanitizeBody('nombre');
	req.sanitizeBody('descripcion');
	req.sanitizeBody('url');

	const grupo = req.body;
	grupo.usuarioId = req.user.id;
	grupo.categoriaId= req.body.categoria;
	
	if(req.file){ // si el usuario subió una imagen
		grupo.imagen = req.file.filename; // ya viene con el nombre generado en el middleware de subir
	// imagen
	}

	try {
		// statements

		await Grupos.create(grupo);
		req.flash('exito','El grupo se ha creado');
		res.redirect('/admin');
	} catch(e) {
		// statements
		const erroresSequelize = e.errors.map(err => err.message);
		req.flash('error',erroresSequelize);
		res.redirect('/nuevo-grupo');
	}
}


exports.actualizarGrupo = async (req, res, next) => {

	req.sanitizeBody('nombre');
	req.sanitizeBody('descripcion');
	req.sanitizeBody('url');

	const {grupoId} = req.params; // el id consecutivo del registro del grupo
	const {id} = req.user; // el request guarda la instancia del usuario logueado, este id es el usuario 
	// que creó el grupo

	const grupo = await Grupos.findOne({where:{ id:grupoId, usuarioId: id}});
	
	if(!grupo){
		req.flash('error','Operación no válida');
		res.redirect('/admin');
		return next();
	}

	//leer datos para actualizarlos con los anteriores

	try{

		const {nombre, categoria, descripcion, url} = req.body;

		grupo.nombre = nombre;
		grupo.categoriaId= categoria;
		grupo.descripcion= descripcion;
		grupo.url = url;

		await grupo.save();

		req.flash('exito','Información actualizada');
		res.redirect('/admin');

	}catch(e){

		const erroresSequelize = e.errors.map(err => err.message);
		req.flash('error',erroresSequelize);
		res.redirect('/editar-grupo/'+grupoId);
	}	

}


//editar la imagen del grupo y eliminar la anterior

exports.actualizarImagenGrupo = async (req, res, next) => {

	const {grupoId} = req.params; // el id consecutivo del registro del grupo
	const {id} = req.user; // el request guarda la instancia del usuario logueado, este id es el usuario 
	// que creó el grupo
	const grupo = await Grupos.findOne({where:{ id:grupoId, usuarioId: id}});

	if(!grupo){
		
		req.flash('error','Operación no válida');
		return res.redirect('/iniciar-sesion');
	}

	//verificar que exista una imagen anterior y venga una nueva imagen cargada

	if(req.file && grupo.imagen) {
		const imagenAnteriorRuta= __dirname+'/../public/uploads/grupos/'+grupo.imagen;
		//eliminar la imagen
		
		fs.unlink(imagenAnteriorRuta,(err) => {
			if(err){
				console.log(err);
			}

			return;
		});
	}

	if(req.file){
		grupo.imagen = req.file.filename;
	}

	await grupo.save();

	req.flash('exito','Imagen actualizada');
	res.redirect('/admin');
}

//eliminar un grupo 

exports.eliminarGrupo = async (req, res)=> {

	const {grupoId} = req.params; // el id consecutivo del registro del grupo
	const {id} = req.user; // el request guarda la instancia del usuario logueado, este id es el usuario 
	// que creó el grupo
	const grupo = await Grupos.findOne({where:{ id:grupoId, usuarioId: id}});

	if(!grupo){
		
		req.flash('error','Operación no válida');
		return res.redirect('/admin');
	}

	if(grupo.imagen){ // si el grupo tiene una imagen, se debe eliminar la imagen

		const imagenAnteriorRuta= __dirname+'/../public/uploads/grupos/'+grupo.imagen;
		//eliminar la imagen
		
		fs.unlink(imagenAnteriorRuta,(err) => {
			if(err){
				console.log(err);
			}
			//WQ0SNFHMRCXE5U.jpeg
			return;
		});
	}

	//eliminar el grupo de la base de datos

	await Grupos.destroy({
		where: {id: grupoId}
	});

	//redireccionar al admin

	req.flash('exito', 'El grupo se eliminó');
	res.redirect('/admin');
}
//COMANDOS UTILES SUBLIME TEXT

/*
	buscar archivos ctrl + p
	colapsar/mostrar barra lateral ctrl + kb
	abrir una nueva terminal ctrl + .
*/