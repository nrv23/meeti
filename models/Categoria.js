const Sequelize = require('sequelize');
const DB = require('../config/db');

const Categorias = DB.define('categorias',{

	id:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: Sequelize.STRING,
	slug: Sequelize.STRING
},{
	timestamps: false
})


module.exports = Categorias;