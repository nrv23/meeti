const Sequelize = require('sequelize');
const DB = require('../config/db');
const slug = require('slug');
const helper = require('../helpers/helper');
const Usuarios = require('./Usuario');
const Grupos = require('./Grupo');

const Meeti = DB.define('meetis',{
	id:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	titulo:{
		type: Sequelize.STRING(100),
		allowNull: false,
		validate:{
			notEmpty:{
				msg: 'Agrega un título'
			}
		}
	},
	slug:{
		type: Sequelize.STRING(100)
	},
	invitado: Sequelize.STRING(50),
	cupo: {
		type: Sequelize.INTEGER,
		defaultValue: 0 // por si no se pone un valor para el cupo
	},

	descripcion:  {
		type: Sequelize.TEXT,
		allowNull: false,
		validate :{
			notEmpty:{
				msg: 'Agrega una descripción'
			}
		}
	},
	fecha:  {
		type: Sequelize.DATEONLY, // este campo almacena solamente la fecha AAAA/MM/DD
		allowNull: false,
		validate :{
			notEmpty:{
				msg: 'Agrega una fecha'
			}
		}
	},

	hora:  {
		type: Sequelize.TIME,
		allowNull: false,
		validate :{
			notEmpty:{
				msg: 'Agrega una hora'
			}
		}
	},
	direccion:  {
		type: Sequelize.STRING(100),
		allowNull: false,
		validate :{
			notEmpty:{
				msg: 'Agrega una dirección'
			}
		}
	},
	ciudad:  {
		type: Sequelize.STRING(50),
		allowNull: false,
		validate :{
			notEmpty:{
				msg: 'Agrega una ciudad'
			}
		}
	},
	estado:  {
		type: Sequelize.STRING(50),
		allowNull: false,
		validate :{
			notEmpty:{
				msg: 'Agrega una estado'
			}
		}
	},

	pais:  {
		type: Sequelize.STRING(5),
		allowNull: false,
		validate :{
			notEmpty:{
				msg: 'Agrega una país'
			}
		}
	},

	ubicacion:{
		type: Sequelize.GEOMETRY('POINT'),// este campo almacena la latitud
		// y longitud en un solo campo
	},
	interesados:{
		type: Sequelize.ARRAY(Sequelize.INTEGER), //POSTGRESQL SOPORTA CAMPOS DE TIPO ARRAY
		// en este caso el array va guardar los ids de los interesados
		defaultValue: [] // se va generar la primera vez como un arreglo vacio
	} 
},{
	hooks:{
		async beforeCreate(meeti){
			const url = slug(meeti.titulo).toLowerCase();
			meeti.slug= url+'-'+helper.getID();
		}
	} 
});

//RELACIONES ENTRE LOS MODELOS

Meeti.belongsTo(Usuarios); // Un meeti pertenece a un usuario
Meeti.belongsTo(Grupos); // Un meeti pertenece a un grupo

module.exports = Meeti;