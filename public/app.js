// Dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = require('../config/settings').PORT;
const connection = require('../config/settings').Connection;
const mongoose = require('mongoose');
const path = require('path');
require('colors');

// MIDDLEWARES

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilitamos la carpeta publica
app.use(express.static(path.resolve(__dirname + '/')));
// ROUTES IMPORTS
app.use(require('../routes/index'));

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