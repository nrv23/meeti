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
	res.render('editar-grupo',{
		nombrePagina: 'Editar Grupo : '+grupo.nombre,
		categorias,
		grupo
	})
}

exports.formEditarImagen = async (req,res) =>{

	const {grupoId} = req.params;
	const grupo = await Grupos.findByPk(grupoId); //findByPk acepta solamente un parametro de busqueda, no usa el where

	res.render('editar-imagen',{
		nombrePagina: 'Editar imagen grupo: '+grupo.nombre,
		grupo
	})
}

exports.formEliminarGrupo = async (req, res ) => {
	
	const {grupoId} = req.params; // el id consecutivo del registro del grupo
	const {id} = req.user; // el request guarda la instancia del usuario logueado, este id es el usuario 
	// que creó el grupo
	const grupo = await Grupos.findOne({where:{ id:grupoId, usuarioId: id}});

	if(!grupo){
		
		req.flash('error','Operación no válida');
		return res.redirect('/admin');
	}

	res.render('eliminar-grupo',{
		nombrePagina: 'Eliminar grupo: '+grupo.nombre,
	})
}


exports.formNuevoMeet = async (req, res ) => {

	const {id} = req.user;
	const grupos = await Grupos.findAll({where:{ usuarioId: id}});

	res.render('nuevo-meeti',{
		nombrePagina: 'Nuevo Meeti',
		grupos
	})
}