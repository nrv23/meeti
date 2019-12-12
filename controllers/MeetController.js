const Meetis = require('../models/Meeti');

exports.nuevoMeet = async (req, res) => {

	const meeti = req.body; // obtener todos los datos del meeti
	const {id} = req.user;
	const lat = req.body.lat;
	const lng = req.body.lng;
	const {cupo} = req.body;
	//asignar el usuario que crea el meeti

	meeti.usuarioId = id;

	//almacena la ubicacion con un point 

	const point = { type: 'Point' , coordinates :[parseFloat(lat),parseFloat(lng)]}; 
	//este objeto debe enviarse siempre asi para que postgresql lo guarde en la columna de 
	//tipo geometry, las coordenadas deben ser tipo float 

	//asignar la ubicacion al meeti 

	meeti.ubicacion= point;

	if(cupo === '') {
		meeti.cupo=0;
	}

	try {
		
		await Meetis.create(meeti);
		req.flash('exito','El meeti ha sido creado');
		res.redirect('/admin')
	
	} catch(e) {
		console.log("error ",e);
		const erroresSequelize = e.errors.map(err => err.message);
		req.flash('error',erroresSequelize);
		res.redirect('/nuevo-meeti')
	}

}

exports.actualizarMeeti = async (req, res) => {
	
	const {id} = req.params;
	const usuarioId = req.user.id; // req guardar la instancia del usuario logueado gracias a passport
	const datosMeeti = req.body;
	const meeti = await Meetis.findOne({where: {id, usuarioId}});

	try {

		if(!meeti){
			req.flash('error','Operación no válida');
			return res.redirect('/editar-meeti/'+id);
		}

		const point = { type: 'Point' , coordinates :[parseFloat(datosMeeti.lat),parseFloat(datosMeeti.lng)]};
		//asignar los valores actualizados 
		meeti.grupoId = datosMeeti.grupoId;
		meeti.titulo = datosMeeti.titulo;
		meeti.invitado= datosMeeti.invitado;
		meeti.fecha= datosMeeti.fecha;
		meeti.hora= datosMeeti.hora;
		meeti.cupo= datosMeeti.cupo;
		meeti.descripcion= datosMeeti.descripcion;
		meeti.direccion= datosMeeti.direccion;
		meeti.ciudad= datosMeeti.ciudad;
		meeti.estado= datosMeeti.estado;
		meeti.pais= datosMeeti.pais;
		meeti.ubicacion= point;

		await meeti.save();
		req.flash('exito','El meeti ha sido actualizado');
		res.redirect('/admin')

	} catch(e) {
		// statements
		console.log(e);
		const erroresSequelize = e.errors.map(err => err.message);
		req.flash('error',erroresSequelize);
		res.redirect('/editar-meeti/'+id);
	}
}

exports.eliminarMeeti = async (req, res) => {
	
	const {id} = req.params;
	const usuarioId = req.user.id;

	try {


		const meeti = await Meetis.findOne({where: {id, usuarioId}});
		
		if(!meeti){
			req.flash('error','Operación no válida');
			return res.redirect('/admin');
		}

		await meeti.destroy();
		req.flash('exito','El meeti ha sido eliminado');
		res.redirect('/admin');

	} catch(e) {
		//
		console.log(e);
		const erroresSequelize = e.errors.map(err => err.message);
		req.flash('error',erroresSequelize);
		res.redirect('/eliminar-meeti/'+id);
	}

}
exports.sanitizarMeeti = (req, res, next) => {
	//sanitizar los campos del form

	req.sanitizeBody('titulo');
	req.sanitizeBody('invitado');
	req.sanitizeBody('cupo');
	req.sanitizeBody('fecha');
	req.sanitizeBody('hora');
	req.sanitizeBody('direccion');
	req.sanitizeBody('ciudad');
	req.sanitizeBody('estado');
	req.sanitizeBody('pais');
	req.sanitizeBody('lat');
	req.sanitizeBody('lng');
	req.sanitizeBody('grupoId');

	next();
}