const Usuarios = require('../../models/Usuario');
const Grupos = require('../../models/Grupo');

exports.mostrarInformacionUsuario = async (req,res) => {

	const {id} = req.params;
	const consultas = [];
	
	consultas.push(Usuarios.findOne({where:{id},attributes: ['nombre','descripcion','imagen']}));
	consultas.push(Grupos.findAll({where:{usuarioId: id}}));

	const [usuario, grupos] = await Promise.all(consultas);
	
	if(!usuario){
		req.flash('error','Operación no válida');
		return res.redirect('/');
	}

	res.render('mostrar-perfil',{
		nombrePagina: 'Perfil Usuario: '+usuario.nombre,
		usuario,
		grupos
	})

}