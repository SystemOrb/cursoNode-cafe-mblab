// Servicio que se encarga de devolver las imagenes a un front
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const tokenizer = require('../middlewares/auth');
app.get('/:pathType/:img', [tokenizer.authVerify], (request, response) => {
    let pathType = request.params.pathType;
    let img = request.params.img;
    let pathValid = ['products', 'profile'];
    try {
        if (pathValid.indexOf(pathType) < 0) {
            // No mando una URL valida
            return response.status(400).json({
                status: false,
                statusCode: 400,
                message: 'No existe esta url'
            });
        }
        // En caso de que exista construimos el path de la imagen
        let img_path = path.resolve(__dirname, '../uploads/' + pathType + '/' + img);
        let no_path = path.resolve(__dirname, '../assets/images/no-image.jpg');
        // Verificamos si existe
        fs.exists(img_path, (exist) => {
            // Si existe entonces la devolvemos
            if (exist) {
                response.sendFile(img_path);
            } else {
                // Entonces devolvemos una por defecto
                response.sendFile(no_path);
            }
        });
    } catch (Exception) {
        throw new Error('Fallo al mostrar la imagen ', Exception);
    }
});

module.exports = app;