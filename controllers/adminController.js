const Categorias = require('../models/Categoria');
const Grupos = require('../models/Grupo');

exports.panelAdmin = async (req, res) => {

	const {id} = req.user;
	const grupos = await Grupos.findAll({where: {usuarioId: id}});
	
	res.render('admin',{
		nombrePagina: 'Panel de Administración',
		grupos
	})
}

exports.formNuevoGrupo = async (req,res ) =>{

	const categorias = await Categorias.findAll();

	res.render('nuevo-grupo',{
		nombrePagina: 'Crea un nuevo grupo',
		categorias
	});
}

exports.formEditarGrupo = async (req, res) =>{

	const {grupoId} = req.params;
	const consultas = [];
	consultas.push(Grupos.findByPk(grupoId));
	consultas.push(Categorias.findAll());

	const [grupo, categorias] = await Promise.all(consultas); // en este caso
	// las promesas se ejecutan al mismo tiempo porque ninguna de las consultas es dependiente
	// de otra
	console.log(grupo);
	console.log(categorias);
	
	res.render('editar-grupo',{
		nombrePagina: 'Editar Grupo : '+grupo.nombre,
		categorias,
		grupo
	})
}