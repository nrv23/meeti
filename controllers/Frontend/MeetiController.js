const Meetis = require('../../models/Meeti');
const Grupos = require('../../models/Grupo');
const Usuarios = require('../../models/Usuario');
const moment = require('moment');
const Sequelize = require('sequelize');

exports.mostrarMeeti = async (req, res) => {
	const {slug} = req.params;
	const meeti = await Meetis.findOne({where: {slug}
		,
		include: [
			{
				model: Grupos
			},{

				model: Usuarios,
				attributes: ['id', 'nombre','imagen']
			}
		]});

	if(!meeti){

		return res.redirect('/');
	}

	res.render('mostrar-meeti',{
		nombrePagina: meeti.titulo,
		meeti,
		moment
	})

}


exports.confirmarAsistencia = async (req, res) => {

	const {id} = req.user;
	const {slug} = req.params;
	const {accion} = req.body;

	//Sequelize.fn, en este caso sequelize utiliza funciones de postgresql para insertar valores 
	// en una columna de tipo array
	//Sequelize.fn es una funcion que recibe 3 parametros, el primero es la funcion que se va ejecutar,
	//en este caso es insertar un valor en el ultimo campo del array, el segundo parametro es donde se va insertar
	// en este caso en la columna de interesado de tipo array, y el tercer parametro es el valor a insertar,
	// en este caso es un valor numerico porque el arrray es de tipo integer porque son los ids de los usuarios
	// interesados en el meeti

	if(accion === 'confirmar'){
		await Meetis.update(
			{'interesados': Sequelize.fn('array_append', Sequelize.col('interesados'), id) },
			{'where': {slug}}
		)

		res.send('Has confirmado tu asistencia');
	}else{
		await Meetis.update(
			{'interesados': Sequelize.fn('array_remove', Sequelize.col('interesados'), id) },
			{'where': {slug}}
		)
		res.send('Has cancelado tu asistencia');
	}
}


exports.mostrarAsistentes= async (req, res) => {
	
	const {slug} = req.params;
	const meeti = await Meetis.findOne({
		where:{slug},
		attributes:['interesados'],
	});

	if(!meeti){
		req.flash('error','Operación no válida');
		return res.redirect('/');
	}

	//extraer la lista de interesados 

	const {interesados} = meeti; // esto devuelve un array que lista los ids de los interesados

	const asistentes = await Usuarios.findAll({
		attributes:['nombre','imagen'],
		where: { id : interesados} // compara con cada id del array interesados
	})

	//renderizar listado de asistentes del meeti


	res.render('asistentes-meeti',{
		nombrePagina: 'Lista de Asistentes del Meeti',
		asistentes
	})

}