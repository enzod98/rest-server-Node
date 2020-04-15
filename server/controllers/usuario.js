const express = require('express');

/* El bcrypt nos permitirá encriptar nuestras contraseñas con Hash */
const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificarToken, verificarAdmin } = require('../middlewares/autenticacion');


const app = express();

app.get('/usuario', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;

    desde = Number(desde);

    Usuario.find({ estado: true }, 'nombre email role estado google img') //  Lo que está dentro del find son los filtros, entra llaves ponemos condiciones y entra apóstrofe ponemos los campos que queremos mostrar
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (error, conteo) => {

                res.json({
                    ok: true,
                    conteo,
                    usuarios
                })
            });

        })


});

app.post('/usuario', verificarToken, (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    })

});


app.put('/usuario/:id', [verificarToken, verificarAdmin], (req, res) => {

    let id = req.params.id;

    //Con el pick nosotros vamos a solicitar una copia del body(primer parámetro), y como segundo parámetro especificamos dentro de un array los valores que podremos modificar desde el put
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Método de mongoose
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })


});

app.delete('/usuario/:id', [verificarToken, verificarAdmin], (req, res) => {

    let id = req.params.id;


    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (error, usuario) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario
        });



    })



    /* Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    }) */


});

module.exports = app;