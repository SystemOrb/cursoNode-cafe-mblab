// Dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = require('../config/settings').PORT;
const connection = require('../config/settings').Connection;
const mongoose = require('mongoose');
require('colors');
// ROUTES IMPORTS
const userRoute = require('../routes/usuarios');
// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// MIDDLEWARES ROUTES
app.use('/usuario', userRoute);
app.get('/', function(req, res) {
    res.send('Hello World')
});
// BBDD CONNECTION
mongoose.connect(connection, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log('La base de datos ha sido conectada'.magenta);
});
// PORT CONNECTION
app.listen(port, () => {
    console.log('Aplicación iniciada en el puerto '.magenta + port);
})