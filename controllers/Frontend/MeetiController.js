const Meetis = require('../../models/Meeti');
const Grupos = require('../../models/Grupo');
const Usuarios = require('../../models/Usuario');
const Categorias = require('../../models/Categoria');
const Comentarios = require('../../models/Comentario');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.mostrarMeeti = async (req, res) => {

	const {id} = req.params;
	const meeti = await Meetis.findOne({where: {id}
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

	//Consultar por meetis cercanos 
	//Sequelize.literal es una funcion que crea un objeto con informacion no escapada

	const ubicacion = Sequelize.literal(`ST_GeomFromText('POINT(
		${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]}
		)')`); // genera una ubicacion entre los puntos de latitud y longitud, es como si pintara
	// una ubicacion en un mapa

	//ST_DISTANCE_Sphere = Retorna la distancia en una linea de metros
	const distancia = Sequelize.fn('ST_DISTANCE_Sphere', Sequelize.col('ubicacion'), ubicacion)
	//obtengo la distancia con al funcion ST_DISTANCE_Sphere le paso las columnas donde se va comparar
	// los datos de ubicacion y le paso la ubicacion.
	//Esta funcion genera distancias entre meetis relacionados y lo almacena en metros

	//obtener los meetis mas cercanos

	const cercanos = await Meetis.findAll({
		order: distancia, //ordena los meetis por la distancia
		where: Sequelize.where(distancia,{
			[Op.lte]: 8000 // donde los meetis esten a un maximo de 2km,
			//las distancias para filtrar los meetis se deben pasar como metros 
		}),
		limit: 3, //limitar a 3 resultados
		offset: 1, // al tener el primer meeti obtener desde el segundo meeti teniendo en cuenta al primero
		include: [
			{
				model: Grupos
			},{

				model: Usuarios,
				attributes: ['id', 'nombre','imagen']
			}
		]
	})

	const comentarios = await Comentarios.findAll({
		where: {
			meetiId: meeti.id
		},
		include :[
			{
				model: Usuarios,
				attributes: ['id', 'nombre','imagen']
			}
		]
	})

	res.render('mostrar-meeti',{
		nombrePagina: meeti.titulo,
		meeti,
		moment,
		comentarios,
		cercanos
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



exports.FiltrarMeetis = async (req, res) => {
	
	const {slug} = req.params;

	const categoria = await Categorias.findOne({
		attributes:['id','nombre'],
		where: {slug}
	});

	if(!categoria){
		req.flash('error','Operación inválida');
		return res.redirect('/');
	}

	const meetis = await Meetis.findAll({

			order: [

				['fecha','ASC'],
				['hora','ASC']
			],
			include:[
				{
					model: Grupos,
					attributes: ['imagen','nombre'],
					where: {categoriaId: categoria.id}
				},
				{
					model: Usuarios,
					attributes: ['nombre','imagen']
				}
			]
	})

	res.render('categoria',{
		nombrePagina: 'Categoría '+categoria.nombre,
		meetis,
		moment
	})
}