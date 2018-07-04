/*
Modelo de categorías
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const catSchema = new Schema({
    cat_name: {
        type: String,
        required: [true, 'Debes introducir el nombre de la categoría']
    },
    cat_description: {
        type: String,
        required: [true, 'Necesitamos la descripción de esta categoría']
    },
    cat_image: {
        type: String,
        required: false
    },
    cat_created: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('categories', catSchema);