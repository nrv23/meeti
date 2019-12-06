const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // autenticancion por medio de usuario y contraseña local
//obtener el modelo para la consulta de autenticacion

const Usuarios = require('../models/Usuario');


//CONFIGURACON DE PASSPORT PARA AUTENTICACION


passport.use(new LocalStrategy({
	//mapear valores de autenticacion de columnas de la base de datos
		usernameField: 'email', 
		passwordField: 'password'
	},
	async (email, password, next) => { // los dos parametros son los valores de email y password
		// que vienen del formulario del LOGIN
		//esta funcion se ejecuta haciendo una consulta a la base de datos para verificar 
		//usuario y contraseña
		const usuario = await Usuarios.findOne({
			where: {email, activo:1} // la cuenta debe estar activa para poder iniciar sesion
		});
		

		if(!usuario) 

			return next(null, false,{
				message: 'El usuario no existe' // mensaje que va mostrar
			
			});

			//en next los parametros son:
			/*
				1- error en caso de que haya
				2- usuario si se devuelve un usuario
				3- un objeto con datos como un mensaje de alerta
			*/
		
			//si el usuario existe comparar su password

			if(!usuario.comparePass(password)){
				return next(null, false,{
					message: 'Usuario o password incorrectos' // mensaje que va mostrar
				});

			}else{

				return next(null, usuario);
			}
		
	}
))

//configuraciones de passport
passport.serializeUser(function(usuario, cd){
	cd(null,usuario);
});

passport.deserializeUser(function(usuario, cd){
	cd(null,usuario);
});

module.exports = passport;