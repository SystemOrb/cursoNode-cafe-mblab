var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    price: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    status: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true }
});


module.exports = mongoose.model('Producto', productoSchema);