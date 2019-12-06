const Sequelize = require('sequelize');
const DB = require('../config/db');
const Categorias = require('./Categoria');
const Usuario = require('./Usuario');

const Grupos = DB.define('grupos',{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: {
		type: Sequelize.STRING(100),
		allowNull: false,
		validate:{
			notEmpty:{
				msg: 'El nombre es requerido'
			}
		}
	},
	descripcion: {
		type: Sequelize.TEXT(500),
		allowNull: false,
		validate:{
			notEmpty:{
				msg: 'El grupo debe tener una descripcion'
			}
		}
	},
	url: Sequelize.STRING(150),
	imagen: Sequelize.STRING(50),
})
//relacionar un grupo con una categoria

Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuario);

module.exports = Grupos;