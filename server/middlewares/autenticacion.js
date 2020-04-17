/* VErificación de Tokens */
const jwt = require('jsonwebtoken');



let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');

    //El verify recibe tres parámetros: el token recibido del head, la semilla y el callback
    jwt.verify(token, process.env.SEMILLA, (error, devolucion) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error: 'Token no válido'
            })
        }

        req.usuario = devolucion.usuario;
        next();

    })
};

/* Verificar rol de ADMIN */

let verificarAdmin = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario);

    if (usuario.role == 'ADMIN_ROLE') {
        next();

    } else {
        return res.json({
            ok: false,
            error: "Debe ser usuario administrador para realizar esta operación"
        })
    }
};

/* Verificar token por url en las imágenes */
verificarTokenImg = (req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.SEMILLA, (error, devolucion) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error: 'Token no válido'
            })
        }

        req.usuario = devolucion.usuario;
        next();

    })

}


module.exports = {
    verificarToken,
    verificarAdmin,
    verificarTokenImg
}