/*
Iniciar sesión con Tokens
*/
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expires = require('../config/settings').expires;
const secret = require('../config/settings').secretKey;

app.post('/', (request, response, next) => {
    let body = request.body;
    try {
        Usuario.findOne({ email: body.email }, (err, userDB) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    requestStatus: 500,
                    message: 'Fallo en el sistema',
                    callback: err
                });
            }
            // Verificamos si encontro el usuario con ese email
            if (!userDB) {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'Email o contraseña invalido',
                    callback: err
                });
            }
            // Entonces existe el email y procedemos a evaluar el pwd
            if (bcrypt.compareSync(body.password, userDB.password)) {
                // Si hace match creamos el token 
                let token = jwt.sign({
                    data: userDB
                }, secret, { expiresIn: expires });
                // Autenticamos con el token
                response.status(200).json({
                    status: true,
                    requestStatus: 200,
                    message: 'Logeado con exito',
                    token
                });
            } else {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'Email o contraseña invalido',
                    callback: err
                });
            }
        });
    } catch (error) {
        throw new Error('No pudo conectar con la base de datos ', error);
    }
});

module.exports = app;