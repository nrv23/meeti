const Meetis = require('../../models/Meeti');
const Grupos = require('../../models/Grupo');
const Usuarios = require('../../models/Usuario');
const moment = require('moment');

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