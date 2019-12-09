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

		const erroresSequelize = e.errors.map(err => err.message);
		req.flash('error',erroresSequelize);
		res.redirect('/nuevo-meeti')
	}

}