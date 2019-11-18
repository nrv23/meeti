const Sequelize = require('sequelize');

const sequelize = new Sequelize('meeti','postgres','postgres',{
	host: '127.0.0.1',
	port: '5432',
	dialect: 'postgres',
	pool:{
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	/*define:{
		timestamps: false //evitar que cree las columnas crearedAt y updatedAt
	}*/
	//deshabilitar los logs de base de datos que muestra sequelize

	//logging: false
});

module.exports = sequelize;