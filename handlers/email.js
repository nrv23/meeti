//Archivo para crear la configuracion y la vista para envias los correos
const nodemailer = require('nodemailer');
const {host,port,user,pass} = require('../config/email');
const fs = require('fs'); // acceder a los archivos y sus contenidos
const util = require('util');
const ejs = require('ejs'); // para compilar un archivo y generar la vista para el email


let Transport = nodemailer.createTransport({
	host,
	port,
	auth:{
		user,
		pass
	}
});


exports.enviarEmail = async (opciones) => {
	
	const {url, archivo, subject} = opciones;
	const {email} = opciones.usuario;
	//TODO
	//leer el archivo para el mail
	const file = __dirname+`/../views/emails/${archivo}.ejs`;
	
	//compilar el archivo
	const compilado = ejs.compile(fs.readFileSync(file,'utf8')); 
	//el segundo parametro
	//es la codificacion de los datos, se pone utf8 por si hay acentos
	//ejs.compile funcion para compilar archivos html, se le pasan los datos de un archivo
	//la variable compilado genera una vista html y se le deben pasar los valores para renderizar


	//crear la vista html
	const html = compilado({url})
	
	//configurar las opciones del email

	const opcionesEmail = {
		from : 'Meeti <noreply@meeti.com>',
		to: email,
		subject,
		html
	}

	//enviar el email

	const sendEmail = util.promisify(Transport.sendMail, Transport);
	return sendEmail.call(Transport, opcionesEmail);
}