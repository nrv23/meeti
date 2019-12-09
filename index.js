require('dotenv').config({path:'variables.env'}); // importar de primero las variables de entorno
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const http = require('http');
const routes = require('./routes');
const app= express();
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const port = process.env.PORT;
const db = require('./config/db');

//correr sequelize para crear la bd
// para generar las tablas se deben importar los modelos

require('./models/Usuario');
require('./models/Categoria');
require('./models/Grupo');
require('./models/Meeti');

db.sync()
	.then(() => {
		console.log("Base de datos ONLINE")
	})
	.catch(err => {
		console.error(err);
	})


//habilitar bodyParser y urlencoded para peticiones de tipo post

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//habiltar express validator para validar los campos del html
app.use(expressValidator());

//utilizar express layouts para crear el master page en ejs
app.use(expressLayouts);

//habilitar ejs en express
app.set('view engine','ejs');


//definir las vistas y el master page de ejs
app.set('views', path.join(__dirname,'./views'));

//habilitar archivos estaticos
app.use(express.static('public'));

//habilitar cookie parser

app.use(cookieParser());

//habilitar la sessiones

app.use(session({
	secret: process.env.SECRETO,
	key: process.env.KEY,
	resave: false,
	saveUninitialized: false
}))

//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//agregar connect flash
app.use(flash());


//crear middleware propio para almacenar usuario logueado, flash messages y fecha actual
app.use((req, res, next) => {
	res.locals.year = new Date().getFullYear();
	res.locals.mensajes = req.flash();
	next();
})

app.use('/', routes()); // habilitar las rutas


//creando y ejecutando el servidor
const server = http.createServer(app); 
server.listen(port, () => {
	console.log("Escuchando enel puerto "+port);
});

// curso de excel

//https://www.curso-excel.online/p/aprender-usar-excel-online.html?fbclid=IwAR2syjc2dTB58lWN5776Z6cJ-TQo7fZxF_miEPEYy1vSGB24rqIO_AHbWoA
//https://www.example-code.com/nodejs/imap_fetchMimeIndividually.asp?fbclid=IwAR0u4LsBBn8eX4jGqoOiIcm90cQBt6QAMqc_Jh-mx5nYfuqWMm7B3H7ypcE
//http://www.androidcurso.com/
//https://www.edx.org/course/android-introduccion-a-la-programacion#.VGzq7jSG_ah