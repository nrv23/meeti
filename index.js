require('dotenv').config({path:'variables.env'});
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const http = require('http');
const routes = require('./routes');
const app= express();
const path = require('path');
const port = process.env.PORT;
const db = require('./config/db');


//correr sequelize para crear la bd
// para generar las tablas se deben importar los modelos

require('./models/Usuario');
db.sync()
	.then(() => {
		console.log("Base de datos ONLINE")
	})
	.catch(err => {
		console.error("No se pudo crear la base de datos");
	})


//utilizar express layouts para crear el master page en ejs

app.use(expressLayouts);

//habilitar ejs en express
app.set('view engine','ejs');


//definir las vistas y el master page de ejs
app.set('views', path.join(__dirname,'./views'));

//habilitar archivos estaticos
app.use(express.static('public'));

app.use((req, res, next) => {
	res.locals.year = new Date().getFullYear(); 

	next();
})


app.use('/', routes());

//crear middleware propio para almacenar usuario logueado, flash messages y fecha actual


//creando y ejecutando el servidor
const server = http.createServer(app); 
server.listen(port, () => {
	console.log("Escuchando enel puerto "+port);
});

