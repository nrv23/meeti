const Meetis = require('../../models/Meeti');
const Grupos = require('../../models/Grupo');
const Usuarios = require('../../models/Usuario');
const Op = require('sequelize').Op;
const moment = require('moment');


exports.buscarMeetis = async (req, res) => {

	const {categoria, titulo, ciudad, pais} = req.query;

	//buscar los meetis 
	let query;

	if(categoria === ''){
		query ='';
	}else{
		query= `where: {
			categoriaId: {[Op.eq] : ${categoria}}
		}`
	}
	const meetis = await Meetis.findAll({
		where: {
			titulo: {
				//busqueda por coincidencia
				[Op.iLike]: '%'+titulo+'%'
			},

			ciudad: {
				//busqueda por coincidencia
				[Op.iLike]: '%'+ciudad+'%'
			},
			pais: {
				//busqueda por coincidencia
				[Op.iLike]: '%'+pais+'%'
			}
		},
		include: [
			{
				model: Grupos,
				query
			},{

				model: Usuarios,
				attributes: ['id', 'nombre','imagen']
			}
		]
	});


	//renderizar los resultados


	res.render('busqueda',{
		nombrePagina: 'Resultados Búsqueda',
		meetis,
		moment
	})
}