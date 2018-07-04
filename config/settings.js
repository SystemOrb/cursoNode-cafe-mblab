/*
Puerto de conexión 
Del cloud o en local
*/
const PORT = process.env.PORT || 3000;

// VARIABLES DE ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'developer';
/*
CONEXIÓN
*/
let Connection;
if (process.env.NODE_ENV === 'developer') {
    Connection = 'mongodb://localhost:27017/cafe'
} else {
    Connection = process.env.MONGO_URI; // protected
}
/*
EXPIRACIÓN DEL TOKEN
*/ // 1 hora
const expires = 60 * 60
    /*
    GENERADOR DE SECRET DEL TOKEN
    */
const secretKey = process.env.MONGO_KEY || 'gjTDqiEObCZQaurTU';
/*
Google credenciales
*/
const googleKey = process.env.GOOGLE || '327052630321-hrm5jh3b8d4nbv0gcb6eohtim8i005us.apps.googleusercontent.com';
module.exports = {
        PORT,
        Connection,
        expires,
        secretKey,
        googleKey
    }
    // Google apikey = 327052630321-hrm5jh3b8d4nbv0gcb6eohtim8i005us.apps.googleusercontent.com
    // Google secretkey= 0pqJyEST0lyuvzotB05JIhSb