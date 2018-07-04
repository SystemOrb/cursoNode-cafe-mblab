/*
Archivo de configuración de las rutas
*/
const express = require('express');
const app = express();

// paths
const userRoute = require('./usuarios');
const loginRoute = require('./login');
const catRoute = require('./categorias');
const productRoute = require('./productos');
//middlewares
app.use('/usuario', userRoute);
app.use('/login', loginRoute);
app.use('/category', catRoute);
app.use('/products', productRoute);
module.exports = app;