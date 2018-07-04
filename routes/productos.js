const express = require('express');
const app = express();
const Product = require('../models/producto');
const _ = require('underscore');
// Obtener lista de productos
app.get('/', (request, response) => {
    // obtenemos la lista de productos de forma pagina
    let limit = Number(request.query.limit) || 5; // limite
    let offset = Number(request.query.offset) || 0; // desde
    try {
        Product.find({ status: true }).skip(offset).limit(limit)
            .sort('description')
            .populate('category')
            .populate('user')
            .exec((err, products) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        statusCode: 500,
                        message: 'Fallo en la conexión, intentalo de nuevo',
                        callback: err
                    });
                }
                response.status(200).json({
                    status: true,
                    statusCode: 200,
                    message: 'Productos cargados',
                    products
                });
            });
    } catch (Exception) {
        throw new Error('Fallo en la conexión ', Exception);
    }
});
// Obtener un producto especifico
app.get('/:id', (request, response) => {
    let id = request.params.id;
    try {
        Product.findById(id)
            .populate('category')
            .populate('user')
            .exec((err, product) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        statusCode: 500,
                        message: 'Fallo en la conexión, intentalo de nuevo',
                        callback: err
                    });
                }
                response.status(200).json({
                    status: true,
                    statusCode: 200,
                    message: 'Producto cargado',
                    product
                });
            });
    } catch (Exception) {
        throw new Error('Fallo en la conexión ', Exception);
    }
});
//Crear un Producto
app.post('/', (request, response) => {
    let formData = request.body;
    let product = new Product({
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        user: formData.user
    });
    // Hacemos el insert 
    try {
        product.save((err, newProduct) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    statusCode: 500,
                    message: 'Fallo en la conexión, intentalo de nuevo',
                    callback: err
                });
            }
            response.status(200).json({
                status: true,
                statusCode: 200,
                message: 'Item agregado correctamente',
                newProduct
            });
        });
    } catch (Exception) {
        throw new Error('Fallo en la conexión ', Exception);
    }
});
// Actualizar un producto
app.put('/:id', (request, response) => {
    let id = request.params.id;
    let formData = request.body;
    try {
        Product.findByIdAndUpdate(id, formData, (err, updated) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    statusCode: 500,
                    message: 'Fallo en la conexión, intentalo de nuevo',
                    callback: err
                });
            }
            if (!updated) {
                return response.status(400).json({
                    status: false,
                    statusCode: 400,
                    message: 'No existe este producto'
                });
            }
            // Entonces actualiza
            response.status(200).json({
                status: true,
                statusCode: 200,
                message: 'Item actualizado correctamente',
                updated
            });
        });
    } catch (Exception) {
        throw new Error('Fallo en la conexión ', Exception);
    }
});
// desactivar un producto
app.put('/disable/:id', (request, response) => {
    let id = request.params.id;
    try {
        let objectUpdate = _.pick(request.body, ['status']);
        Product.findByIdAndUpdate(id, objectUpdate, (err, updated) => {
            if (err) {
                return response.status(500).json({
                    status: false,
                    statusCode: 500,
                    message: 'Fallo en la conexión, intentalo de nuevo',
                    callback: err
                });
            }
            if (!updated) {
                return response.status(400).json({
                    status: false,
                    statusCode: 400,
                    message: 'No existe este producto'
                });
            }
            response.status(200).json({
                status: true,
                statusCode: 200,
                message: 'Item actualizado correctamente',
                updated
            });
        });
    } catch (Exception) {
        throw new Error('Fallo en la conexión ', Exception);
    }
});
// Buscador inteligente
app.get('/search/:query', (request, response) => {
    let find = new RegExp(request.params.query, 'i');
    try {
        Product.find({ name: find })
            .sort('name')
            .populate('category')
            .populate('user')
            .exec((err, products) => {
                if (err) {
                    return response.status(500).json({
                        status: false,
                        statusCode: 500,
                        message: 'Fallo en la conexión, intentalo de nuevo',
                        callback: err
                    });
                }
                if (!products) {
                    return response.status(400).json({
                        status: false,
                        statusCode: 400,
                        message: 'No existe este producto'
                    });
                }
                response.status(200).json({
                    status: true,
                    statusCode: 200,
                    message: 'Items encontrados',
                    products
                });
            });
    } catch (Exception) {
        throw new Error('Fallo en la conexión ', Exception);
    }
});
module.exports = app;