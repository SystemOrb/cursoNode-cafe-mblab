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
const googleID = require('../config/settings').googleKey;
const { OAuth2Client } = require('google-auth-library');

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
// Con Google
const client = new OAuth2Client(googleID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    return ticket.getPayload();
}
app.post('/google', async(request, response) => {
    let token = request.body.idtoken; // Capturamos el token de google
    // Verificamos si es un token valido
    let payload = await verify(token);
    // Verificamos si existe este usuario en la base de datos
    Usuario.findOne({ email: payload.email }, (err, userDB) => {
        if (err) {
            return response.status(500).json({
                status: false,
                requestStatus: 500,
                message: 'Fallo en el sistema',
                callback: err
            });
        }
        // Si no encuentra un usuario entonces lo creamos y autenticamos
        if (!userDB) {
            let usuario = new Usuario({
                name: payload.name,
                email: payload.email,
                password: ':)',
                img: payload.picture,
                Google: true
            });
            // Guardamos en la base de datos
            try {
                usuario.save((err, newUser) => {
                    if (err) {
                        return response.status(500).json({
                            status: false,
                            requestStatus: 500,
                            message: 'Fallo en el sistema',
                            callback: err
                        });
                    }
                    // Creamos un nuevo Token para la aplicación
                    let token = jwt.sign({
                        data: newUser
                    }, secret, { expiresIn: expires });
                    // Autenticamos
                    response.status(200).json({
                        status: true,
                        requestStatus: 200,
                        message: 'Registrado con éxito',
                        token
                    });
                });
            } catch (Exception) {
                throw new Error('No pudimos procesar tu solicitud ', Exception);
            }
        } else {
            /*
            Entonces encontro un usuario, ahora verificamos que este usuario
            fue autenticado con Google o normal
            */
            if (userDB.Google === false) {
                // Si no es de Google entonces lo rechazamos
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'Este usuario ya ha sido registrado de forma normal'
                });
            }
            // Creamos el token de la aplicación
            let token = jwt.sign({
                data: userDB
            }, secret, { expiresIn: expires });
            response.status(200).json({
                status: true,
                requestStatus: 200,
                message: 'Logeado con éxito',
                token
            });
        }

    });
    //Usuario.findOne({ email:  })
});
module.exports = app;