/*
Esquema que tendrá los usuarios de la aplicación
*/
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario para tu perfíl']
    },
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Introduce una contraseña valida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: {
            values: ['USER_ROLE', 'ADMIN_ROLE'],
            message: '{VALUE} es inválido'
        }
    },
    status: {
        type: Boolean,
        default: true
    },
    Google: {
        type: Boolean,
        default: false
    }
});
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
userSchema.plugin(uniqueValidator, {
    message: 'Error, el campo {PATH} debe ser unico'
});
module.exports = mongoose.model('usuarios', userSchema);