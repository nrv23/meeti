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
	res.redirect('/meeti/'+meetiId);

}


exports.eliminarComentario = async (req, res, next) => {
	
	const {idComentario} = req.body;

	const comentario = await Comentario.findOne({
		where:{
			id: idComentario
		}
	});

	if(!comentario){
		res.status(404).send('No válido');
		return next();
	}

	const meeti = await Meeti.findOne({
		where:{
			id: comentario.meetiId
		}
	});

	if(req.user.id === comentario.usuarioId || meeti.usuarioId === req.user.id){
		// las condiciones son si la persona que creó el comentario lo quiere borrar o
		// si la persona que creó el meeti quiere borrar el comentario
		await Comentario.destroy({
			where: { //eliminar el comentario por el id
				id: comentario.id
			}
		})
		res.status(200).send("Comentario eliminado");
		return next();

	}else{
		res.status(403).send('No válido');
		return next();
	}

	
}