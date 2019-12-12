const Sequelize = require('sequelize');
const DB = require('../config/db');
const bcrypt = require('bcrypt-nodejs');


const Usuarios = DB.define('usuario',{
	id:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: {
		type: Sequelize.STRING(60),
		allowNull: false,
		validate:{
			notEmpty: {
				msg: 'El nombre es requerido'
			}
		}
	},
	descripcion:{
		type: Sequelize.STRING(250)
	},
	email:{
		type: Sequelize.STRING(40),
		allowNull: false,
		validate:{
			isEmail:{
				msg: 'Agrega un email válido'
			}
		},
		unique:{
			args: true, // activar el indice unico para los correos
			msg: 'El email ya existe' // si se intente reguistrar un email existente se va mostrar
			//este mensaje
		}
	},
	password: {
		type: Sequelize.STRING(60),
		allowNull: false,
		validate:{
			notEmpty: {
				msg: 'El password es requerido'
			}
		}
	},
	activo: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	tokenPassword: Sequelize.STRING,
	expiraToken: Sequelize.DATE,
	imagen: Sequelize.STRING(40)

},{
	hooks:{
		//hashear la contraseña antes de crear el usuario
		//sequelize tiene hooks que son funciones que se ejecutan antes o despues de alguna accion

		beforeCreate(usuario){
	

			usuario.password = usuario.hashPassword(usuario.password);
		}
	}
});

//Funciones personalizadas

Usuarios.prototype.comparePass = function(password){
	
	return bcrypt.compareSync(password, this.password);
};

Usuarios.prototype.hashPassword = function(password){
	
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null);
};

module.exports= Usuarios;