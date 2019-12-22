const Categorias = require('../models/Categoria');
const Meetis = require('../models/Meeti');
const Grupos = require('../models/Grupo');
const Usuarios = require('../models/Usuario');
const moment = require('moment');
const Op = require('sequelize').Op;

exports.inicio= async (req, res) => {

	const consultas = [];
	consultas.push(Categorias.findAll({}));
	consultas.push(Meetis.findAll({
		attributes: ['slug','titulo', 'fecha','hora','id'], //este arreglo son los campos que necesito traer en la consulta
		where: {// filtrar por fechas, el operador gte filtra por fecha igual o mayor a la fecha 
			// que hay en los registros de la bd, moment convierte la fecha actual en formato año/mes/dia
			fecha : {[Op.gte]: moment(new Date()).format("YYYY-MM-DD")}
		},
		limit: 3 , //limitar numero de registros obtenidos
		order:[
			['fecha', 'ASC'] // ordenar los registros por fecha de forma ascendente
		], 
		include :[
			{ // implementar JOINS
					model: Grupos, //join a la tabla de grupos,
					attributes: ['imagen'] //obtener la imagen del grupo relacionado
			},{ // implementar JOINS
					model: Usuarios, //join a la tabla de grupos,
					attributes: ['nombre','imagen'] //
			}
		]
	}))

	const [categorias, meetis] = await Promise.all(consultas);

	res.render('home',{
		nombrePagina : 'Inicio',
		categorias,
		meetis,
		moment
	})
}
//hacer declaraciones de hacienda mañana

