const Categorias = require('../models/Categoria');
const Grupos = require('../models/Grupo');
const Meetis = require('../models/Meeti');
const moment = require('moment'); // manejo de fechas
const Op = require('sequelize').Op; // operadores de comparacion en consultas de sequelize, leer documentacion
// para ver la lista de los operadores de comparacion de sequelie

exports.panelAdmin = async (req, res) => {

	const {id} = req.user;
	//const grupos = await Grupos.findAll({where: {usuarioId: id}});
	//const meetis = await Meetis.findAll({where: {usuarioId: id}});

	const array = [];
	const fechaComparacion = moment(new Date()).format('YYYY-MM-DD');

	array.push(Grupos.findAll({where: {usuarioId: id}}));

	array.push(Meetis.findAll(
		{where: {usuarioId: id, 
		fecha :{[Op.gte]: fechaComparacion}
	}})); // filtrar meetis que sea mayores o iguales a la fecha actual

	array.push(Meetis.findAll(
		{where: {usuarioId: id, 
		fecha :{[Op.lt]: fechaComparacion}
	}})); //estos meetis son los que ya estan pasados y se van a listar por si se quiere volver a generar un meeti 
	//igual
	
	const [grupos,meetis,anteriores] = await Promise.all(array);

	res.render('admin',{
		nombrePagina: 'Panel de Administración',
		grupos,
		meetis,
		moment,
		anteriores
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


exports.formEditarMeeti= async (req, res) => {

	const {id} = req.params;
	const consultas = [];
	
	consultas.push(Grupos.findAll({where:{ usuarioId: id}}));
	consultas.push(Meetis.findByPk(id)); // TRAER EL MEETI POR EL ID DEL MEETI

	const [grupos, meeti] = await Promise.all(consultas);
	
	if(!grupos || !meeti){
		req.flash('error','Operación no válida');
		return res.redirect('/admin');
	}

	res.render('editar-meeti',{
		nombrePagina: 'Editar Meet: '+meeti.titulo,
		grupos,
		meeti
	})
} 