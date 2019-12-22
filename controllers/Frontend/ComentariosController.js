const Comentario = require('../../models/Comentario');
const Meeti = require('../../models/Meeti');

exports.agregarComentario = async (req, res ) => {
	
	const meetiId = req.params.id;
	const {id} = req.user;
	const mensaje = req.body.comentario;

	await Comentario.create({
		mensaje,
		usuarioId: id,
		meetiId
	})

	req.flash('exito','El comentario se ha agregado');
	res.redirect('/meeti/'+id);

}