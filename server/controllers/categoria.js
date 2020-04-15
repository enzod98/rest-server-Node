const express = require('express');

const { verificarToken, verificarAdmin } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');

const app = express();


/* MOSTRAR TODAS LAS CATEGORIAS */
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find()
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((error, categoriaDB) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            Categoria.count((error, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    categoriaDB
                })
            });
        })
});


/* MOSTRAR UNA CATEGORIA POR ID */
app.get('/categoria/:id', verificarToken, (req, res) => {

    let categoriaID = req.params.id;

    Categoria.findById(categoriaID, (error, categoriaBD) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se pudo encontrar la categoria con el ID solicitado"
                }
            })
        }

        return res.json({
            ok: true,
            categoriaBD
        })

    })


});


/* CREAR UNA NUEVA CATEGORIA */
app.post('/categoria', verificarToken, (req, res) => {

    let usuarioID = req.usuario._id
    let categoria = new Categoria({
        nombre: req.body.nombreCategoria,
        usuario: usuarioID
    });

    categoria.save((error, categoriaDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }
        res.json({
            ok: true,
            usuario: categoriaDB
        })

    })


    //retorna la nueva categoria creada


});


/* ACTUALIZAR UNA CATEGORIA */
app.put('/categoria/:id', verificarToken, (req, res) => {

    let categoriaID = req.params.id;
    let nuevoNombre = req.body.nombre

    Categoria.findByIdAndUpdate(categoriaID, { nombre: nuevoNombre }, { new: true }, (error, categoriaBD) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se pudo encontrar la categoria con el ID solicitado"
                }
            })
        }

        return res.json({
            ok: true,
            categoriaBD
        })

    })

    //retorna la nueva categoria modificada, sólo se modifica el nombre
});

/* ELIMINAR UNA CATEGORIA */
app.delete('/categoria/:id', [verificarToken, verificarAdmin], (req, res) => {

    let categoriaID = req.params.id;

    Categoria.findByIdAndRemove(categoriaID, (error, categoriaBorrada) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoriaBorrada
        })

        //solo puede ser borrada por un administrador
        //Eliminar de la BD
    });
})


module.exports = app;