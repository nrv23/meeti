const Sequelize = require('sequelize');
const Usuario = require('./Usuario');
const DB = require('../config/db');
const Meeti = require('./Meeti');

const Comentarios = DB.define('comentarios',{
	id:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	mensaje : Sequelize.TEXT
});

//relaciones entre los modelos 
Comentarios.belongsTo(Usuario);
Comentarios.belongsTo(Meeti);


module.exports= Comentarios;
