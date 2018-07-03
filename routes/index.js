/*
Archivo de configuración de las rutas
*/
const express = require('express');
const app = express();

// paths
const userRoute = require('./usuarios');
const loginRoute = require('./login');

//middlewares
app.use('/usuario', userRoute);
app.use('/login', loginRoute);

module.exports = app;