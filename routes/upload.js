// Dependencias
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
// Modelos
const usuario = require('../models/usuario');
const product = require('../models/producto');
// Middleware
app.use(fileUpload({
    limits: { fileSize: (50 * 1024 * 1024) }
}));

app.put('/:path/:id/', (request, response) => {
    let id = request.params.id;
    let path = request.params.path;
    // Verificamos si existe un archivo
    if (!request.files) {
        return response.status(400).json({
            status: false,
            statusCode: 400,
            message: 'No has cargado ningun archivo!'
        });
    }
    // Guardamos el nombre del archivo
    let file = request.files.filename;
    // Validaciones que aceptara el backend
    let validExtensions = ['jpg', 'jpeg', 'gif', 'png', 'svg'];
    // Separamos el string para obtener la extension
    let cutName = file.name.split('.');
    // Obtenemos la extensión de la ultima posición
    let getExtensionName = cutName[cutName.length - 1];
    // Verificamos si el tipo esta en el array permitido
    if (validExtensions.indexOf(getExtensionName) < 0) {
        return response.status(400).json({
            status: false,
            statusCode: 400,
            message: 'La extensión del archivo no es permitido!'
        });
    }
    // Verificamos si la ruta es valida
    let pathValid = ['products', 'profile'];
    // Renombramos el archivo para evitar cache
    if (pathValid.indexOf(path) < 0) {
        // Entonces el usuario mando una ruta incorrecta
        return response.status(500).json({
            status: false,
            statusCode: 500,
            message: 'La ruta no existe'
        });
    }
    // Renombramos el archivo unico con Hash para evitar el cache
    let newFileName = id + new Date().getMilliseconds() + file.name;
    // Entonces movemos 
    console.log(path);
    file.mv('uploads/' + path + '/' + newFileName, (err) => {
        if (err) {
            return response.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Fallo al cargar el archivo'
            });
        }
        // uploadUserProfile(id, response, newFileName);
        // Evaluamos en donde hara el update
        switch (path) {
            case 'products':
                uploadProductProfile(id, response, newFileName);
                break;
            case 'profile':
                uploadUserProfile(id, response, newFileName);
                break;
        }
    });
});
let uploadUserProfile = async(id, response, fileName) => {
    try {
        // Buscamos el usuario con el ID
        usuario.findById(id, (err, data) => {
            if (err) {
                // Borramos la imagen recien cargada
                deleteFile('profile', fileName, response);
                return response.status(500).json({
                    status: false,
                    statusCode: 500,
                    message: 'Fallo al actualizar'
                });
            }
            // Eliminamos la imagen anterior
            deleteFile('profile', data.img, response);
            // Remplazamos por la nueva imagen
            data.img = fileName;
            data.save((err, update) => {
                if (err) {
                    deleteFile('profile', fileName, response);
                    return response.status(500).json({
                        status: false,
                        statusCode: 500,
                        message: 'Fallo al actualizar'
                    });
                }
                response.status(200).json({
                    status: true,
                    statusCode: 200,
                    message: 'perfil actualizado con éxito',
                    update
                })
            });
        });
    } catch (Exception) {
        throw new Error('Error al conectar con la base de datos ', Exception);
    }
}
let uploadProductProfile = async(id, response, fileName) => {
    try {
        product.findById(id, (err, data) => {
            if (err) {
                // Borramos la imagen recien cargada
                deleteFile('products', fileName, response);
                return response.status(500).json({
                    status: false,
                    statusCode: 500,
                    message: 'Fallo al actualizar'
                });
            }
            deleteFile('products', data.img, response);
            data.img = fileName;
            data.save((err, update) => {
                if (err) {
                    deleteFile('products', fileName, response);
                    return response.status(500).json({
                        status: false,
                        statusCode: 500,
                        message: 'Fallo al actualizar este producto'
                    });
                }
                response.status(200).json({
                    status: true,
                    statusCode: 200,
                    message: 'producto actualizado con éxito',
                    update
                })
            });
        });
    } catch (Exception) {
        throw new Error('Error al conectar con la base de datos ', Exception);
    }
}
let deleteFile = async(pathType, fileName, response) => {
    // eliminar un archivo del servidor
    // Construimos la URL
    let old_path = path.resolve(__dirname, '../uploads/' + pathType + '/' + fileName);
    // Verificamos si existe el archivo
    fs.exists(old_path, (exists) => {
        if (exists) {
            // entonces eliminamos
            fs.unlink(old_path, (err) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        statusCode: 500,
                        message: 'No pudo eliminar el archivo',
                        err
                    });
                }
            });
        }
    });
}
module.exports = app;