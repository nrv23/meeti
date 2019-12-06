const Grupos = require('../models/Grupo'); 
const multer = require('multer'); // subir imagenes al servidor
const helper = require('../helpers/helper');

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
