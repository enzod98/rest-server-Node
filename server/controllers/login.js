const express = require('express');

/* El bcrypt nos permitirá encriptar nuestras contraseñas con Hash */
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })

})

//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true

    }

}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(error => {
            return res.status(403).json({
                ok: false,
                message: error //Verificar

            })
        })

    Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error: 'Algo salió mal'
            });
        }


        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Ya está registrado con este correo, utilice la autenticación normal"
                    }
                });
            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //Si el usuario no existe en la BD

            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: 'Alv prroo entraste por gugol xddxd'
            })

            usuario.save((error, usuarioDB) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    })
                }
            })

        }
    })


})




module.exports = app;