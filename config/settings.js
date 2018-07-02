/*
Puerto de conexión 
Del cloud o en local
*/
const PORT = process.env.PORT || 3000;

// ENVIROMENT 
process.env.NODE_ENV = process.env.NODE_ENV || 'developer';
/*
CONNECTION
*/
let Connection;
if (process.env.NODE_ENV === 'developer') {
    Connection = 'mongodb://localhost:27017/cafe'
} else {
    Connection = 'mongodb://cafe.admin:Car123456@ds125001.mlab.com:25001/cafe';
}
module.exports = {
    PORT,
    Connection
}