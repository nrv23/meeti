const Grupos = require('../../models/Grupo');
const Meeti = require('../../models/Meeti');
const moment = require('moment');

exports.mostrarinformacionGrupo = async (req, res)=> {

	const {id} = req.params;
	const consultas = [];

	consultas.push(Grupos.findOne({where:{id}}));
	consultas.push(Meeti.findAll({
			where: {grupoId: id},
			order: [
	
				['fecha', 'ASC']
			]
		}))

	const [grupo, meetis] = await Promise.all(consultas);

	if(!grupo){
		req.flash('error','Operación no válida');
		return res.redirect('/');
	}

	res.render('mostrar-grupo',{
		nombrePagina: 'Informacion Grupo: '+grupo.nombre,
		grupo,
		meetis,
		moment
	})


}