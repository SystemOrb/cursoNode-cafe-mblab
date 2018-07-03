/*
Ruta o servicio que se encarga de hacer los CRUD 
y conexiones en la base de datos de usuarios
*/
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require("underscore");
const tokenizer = require('../middlewares/auth');
app.get('/', (request, response, next) => {
    // VAMOS A HACER UNA LISTA PAGINADA OPCIONAL
    let limit = Number(request.query.limit) || 5; // Por parametro o 5 por defecto
    let offset = Number(request.query.offset) || 0; // Mostrar resultados desde | 5 defecto
    try {
        // '' campos que se desea mostrar
        Usuario.find({ status: true }, 'name email status role Google _id')
            .skip(offset) // desde la pagina que va a mostrar resultados
            .limit(limit) // La cantidad de resultados que va a mostrar
            .exec((err, usuarios) => { // Ejecuta la query
                if (err) {
                    return response.status(400).json({
                        status: false,
                        requestStatus: 400,
                        message: 'No pudo mostrar los usuarios',
                        callback: err
                    });
                }
                // Contamos al cantidad de resultados devueltos
                try {
                    Usuario.count({ status: true }, (err, items) => {
                        if (err) {
                            return response.status(400).json({
                                status: false,
                                requestStatus: 400,
                                message: 'No pudo contar la cantidad de usuarios',
                                callback: err
                            });
                        }
                        // Devolvemos todos los resultados solicitados
                        response.status(200).json({
                            status: true,
                            requestStatus: 200,
                            message: 'Usuario cargados correctamente',
                            data: usuarios,
                            count: items
                        });
                    }); // Contar la cantidad de registros 
                } catch (error) {
                    throw new Error('No pudo conectar con la base de datos '.red, error);
                }
            })
    } catch (error) {
        throw new Error('No pudo conectar con la base de datos '.red, error);
    }
});
app.post('/', [tokenizer.authVerify, tokenizer.role], (request, response, next) => {
    // Parseamos a url-8encode la data
    let body = request.body;
    //creamos un nuevo objeto de tipo usuario (Schema)
    let new_user = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });
    // Hacemos el insert en la bbdd
    try {
        new_user.save((err, userDB) => {
            if (err) {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'No pudo crear el nuevo usuario',
                    callback: err
                });
            }
            response.status(201).json({
                status: true,
                requestStatus: 201,
                message: 'Usuario creado correctamente',
                userDB,
                session: request.data
            });
        });
    } catch (error) {
        throw new Error('No pudo conectar con la base de datos '.red, error);
    }
});
app.put('/:id', [tokenizer.authVerify], (request, response, next) => {
    let id = request.params.id;
    // _pick de underscore para filtrar los datos que queremos manipular
    let objectUpdate = _.pick(request.body, ['name', 'email', 'role', 'status']);
    try { // new y runValidators para que el update tenga a fuerza las validaciones
        Usuario.findByIdAndUpdate(id, objectUpdate, { new: true, runValidators: true }, (err, userDB) => {
            if (err) {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'No pudo actualizar el nuevo usuario',
                    callback: err
                });
            }
            if (!userDB) {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'No existe el usuario solicitado',
                });
            }
            response.status(200).json({
                status: true,
                requestStatus: 200,
                message: 'Usuario actualizado correctamente',
                userDB
            });
        });
    } catch (error) {
        throw new Error('No pudo conectar con la base de datos '.red, error)
    }
});
app.delete('/:id', [tokenizer.authVerify], (request, response, next) => {
    // Para eliminar un registro de forma fisica de la bbdd
    let id = request.params.id;
    try {
        Usuario.findByIdAndRemove(id, (err, userDB) => {
            if (err) {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'No pudo eliminar el usuario',
                    callback: err
                });
            }
            // Si no existe el Usuario, Entonces no existe el ID
            if (!userDB) {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'No se encontro este usuario',
                });
            }
            response.status(200).json({
                status: true,
                requestStatus: 200,
                message: 'Usuario eliminado correctamente',
                userDB
            });
        });
    } catch (error) {
        throw new Error('No pudo conectar con la base de datos '.red, error);
    }
});
app.put('/baja/:id/', [tokenizer.authVerify], (request, response, next) => {
    // para actualizar el estado de un usuario ALTA|BAJA
    let id = request.params.id;
    try {
        // Solo queremos el status 
        let objectUpdate = _.pick(request.body, ['status']);
        Usuario.findByIdAndUpdate(id, objectUpdate, { new: true }, (err, userDB) => {
            if (err) {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'No pudo eliminar el usuario',
                    callback: err
                });
            }
            if (!userDB) {
                return response.status(400).json({
                    status: false,
                    requestStatus: 400,
                    message: 'No se encontro el usuario'
                });
            }
            response.status(200).json({
                status: true,
                requestStatus: 200,
                message: 'Usuario dado de baja correctamente',
                userDB
            });
        });
        //Usuario.findByIdAndUpdate
    } catch (error) {
        throw new Error('No pudo conectar con la base de datos '.red, error);

    }
});
module.exports = app;