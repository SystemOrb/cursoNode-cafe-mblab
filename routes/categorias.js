/*
Servicios que manipularán las categorías
*/
const express = require('express');
const app = express();
const tokenizer = require('../middlewares/auth');
const categories = require('../models/categorias');
// Devolver todas las categorías
app.get('/', (request, response) => {
    categories.find({}, (err, catData) => {
        if (err) {
            return response.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Fallo al cargar las categorias, inténtalo de nuevo',
                callback: err
            });
        }
        if (!catData) {
            // Entonces no existen registros
            return response.status(200).json({
                status: true,
                statusCode: 200,
                message: 'No existen categorías'
            });
        }
        // Devolvemos las categorías
        response.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Categorías cargada con éxito',
            catData
        });
    });
});
// Elegir una categoría por ID
app.get('/:id', (request, response) => {
    let id = request.params.id;
    // Buscamos la categoría especifica
    categories.findById(id, (err, catData) => {
        if (err) {
            return response.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Fallo al cargar la categoria, inténtalo de nuevo',
                callback: err
            });
        }
        // Verificamos si devuelve alguna data
        if (!catData) {
            return response.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Esta categoría no existe',
                callback: err
            });
        }
        // Devolvemos la data de la categoria
        response.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Categoria encontrada',
            catData
        });
    });
});
// Crear una nueva categoría
app.post('/', [tokenizer.authVerify, tokenizer.role], (request, response) => {
    let formData = request.body;
    let tokenInfo = request.data;
    // Creamos una nueva categoria
    let new_cat = new categories({
        cat_name: formData.cat_name,
        cat_description: formData.cat_description,
        cat_created: tokenInfo.data._id
    });
    new_cat.save((err, catData) => {
        if (err) {
            return response.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Fallo al cargar la categoria, inténtalo de nuevo',
                callback: err
            });
        }
        response.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Categoria creada correctamente',
            catData
        });
    });
});
// Actualizar una categoria
app.put('/:id', [tokenizer.authVerify, tokenizer.role], (request, response) => {
    let id = request.params.id;
    let body = request.body;
    categories.findByIdAndUpdate(id, body, (err, catData) => {
        if (err) {
            return response.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Fallo al cargar la categoria, inténtalo de nuevo',
                callback: err
            });
        }
        if (!catData) {
            return response.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Esta categoría no existe',
                callback: err
            });
        }
        // Entonces actualizamos
        response.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Categoria actualizada correctamente',
            catData
        });
    });
});
/*
ELIMINAR UNA CATEGORIA
*/
app.delete('/:id', [tokenizer.authVerify, tokenizer.role], (request, response) => {
    let id = request.params.id;
    categories.findByIdAndRemove(id, (err, removed) => {
        if (err) {
            return response.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Fallo al cargar la categoria, inténtalo de nuevo',
                callback: err
            });
        }
        if (!removed) {
            return response.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Esta categoría no existe',
                callback: err
            });
        }
        response.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Categoria eliminada correctamente',
            removed
        });
    });
});
module.exports = app;