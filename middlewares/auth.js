/*
Verifica si un token es valido
*/
const jwt = require('jsonwebtoken');
const secret = require('../config/settings').secretKey;
module.exports.authVerify = (request, response, next) => {
        let token = request.query.token;
        // Verificamos si envio un token de seguridad
        if (!token) {
            return response.status(401).json({
                status: false,
                requestStatus: 401,
                errType: 'Unauthorized',
                message: 'El token ha vencido'
            });
        }
        // Ahora verificamos si el token es valido
        jwt.verify(token, secret, async(err, decoded) => {
            if (err) {
                // Entonces el token no es correcto o intento modificarlo
                return response.status(401).json({
                    status: false,
                    requestStatus: 401,
                    errType: 'Unauthorized',
                    message: 'El token ha vencido'
                });
            }
            // Si pasa todas estas validaciones entonces es un token correcto
            request.data = decoded;
            next();
        })
    }
    // VERIFICACIÓN DE ROL DE USUARIO
module.exports.role = async(request, response, next) => {
    // Capturamos la data del token del middleware 
    let session = request.data;
    // Verificamos el ROL del usuario
    if (session.data.role === 'USER_ROLE') {
        return response.status(401).json({
            status: false,
            requestStatus: 401,
            errType: 'Unauthorized',
            message: 'No tienes permisos para hacer esta petición'
        });
    }
    next();
}