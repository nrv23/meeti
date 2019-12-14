const Categorias = require('../models/Categoria');

exports.inicio= async (req, res) => {

	const consultas = [];
	consultas.push(Categorias.findAll({}));

	const [categorias] = await Promise.all(consultas);
	console.log(categorias)

	res.render('home',{
		nombrePagina : 'Inicio',
		categorias
	})
}

