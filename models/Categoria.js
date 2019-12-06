const Sequelize = require('sequelize');
const DB = require('../config/db');

const Categorias = DB.define('categorias',{

	id:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: Sequelize.STRING
})


module.exports = Categorias;