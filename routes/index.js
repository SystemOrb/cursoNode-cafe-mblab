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
const fileRoute = require('./upload');
const imagesRoute = require('./imagenes');
//middlewares
app.use('/usuario', userRoute);
app.use('/login', loginRoute);
app.use('/category', catRoute);
app.use('/products', productRoute);
app.use('/upload', fileRoute);
app.use('/images', imagesRoute);
module.exports = app;