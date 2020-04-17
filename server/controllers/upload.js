const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path')

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: "No se seleccionó ningún archivo"
            }
        });
    }

    //validar los tipos permitidos
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `El tipo ${ tipo } no es válido`
            }
        })
    }

    // el nombre que tendrá nuestro archivo cuando pongamos el input será "archivo"
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]; //Para añadir a la variable el valor que se encuentra en la última posición de nuestro array, en este caso será la extensión


    //Extensiones permitidas
    let extensionesValidas = ['pnj', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `La extensión ${ extension } no es válida`
            }
        })
    }

    //cambiar el nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aquí, la imagen ya se cargó
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }

    });

    function imagenUsuario(id, res, nombreArchivo) {
        Usuario.findById(id, (error, usuarioDB) => {
            if (error) {
                /* Llamamos la función de borrar archivos para borrar el archivo que se subió y no corresponde a un id válido */
                borrarArchivo(nombreArchivo, 'usuarios');
                res.status(500).json({
                    ok: false,
                    error
                })
            }

            if (!usuarioDB) {
                borrarArchivo(nombreArchivo, 'usuarios');
                res.status(400).json({
                    ok: false,
                    error: {
                        message: 'El usuario con el id especificado no existe'
                    }
                })

            }

            borrarArchivo(usuarioDB.img, 'usuarios')

            usuarioDB.img = nombreArchivo;
            usuarioDB.save((error, usuarioDB) => {
                res.json({
                    ok: true,
                    usuarioDB,
                    img: nombreArchivo
                })
            })

        })
    }

    function imagenProducto() {
        Producto.findById(id, (error, productoDB) => {
            if (error) {
                /* Llamamos la función de borrar archivos para borrar el archivo que se subió y no corresponde a un id válido */
                borrarArchivo(nombreArchivo, 'productos');
                res.status(500).json({
                    ok: false,
                    error
                })
            }

            if (!productoDB) {
                borrarArchivo(nombreArchivo, 'productos');
                res.status(400).json({
                    ok: false,
                    error: {
                        message: 'El producto con el id especificado no existe'
                    }
                })

            }

            borrarArchivo(productoDB.img, 'productos')

            productoDB.img = nombreArchivo;
            productoDB.save((error, productoDB) => {
                res.json({
                    ok: true,
                    productoDB,
                    img: nombreArchivo
                })
            })

        })
    }

    function borrarArchivo(nombreImagen, tipo) {
        /* Vamos a borrar la imagen del usuario en caso de que tenga uno */
        let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)

        /* la siguiente función devuelve un true en caso de que exista esa ruta de archivo */
        if (fs.existsSync(pathImagen)) {
            /* Función de filesystem para borrar archivos */
            fs.unlinkSync(pathImagen);
        }
    }

});


module.exports = app;