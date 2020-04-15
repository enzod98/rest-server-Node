const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion');

const _ = require('underscore');

const Producto = require('../models/producto');

const app = express();



/* Obtener todos los productos */
app.get('/producto', verificarToken, (req, res) => {
    //Traer todos los productos
    //pupalate: usuario y categoria
    //paginado

    let desde = req.query.desde || 0;

    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((error, productos) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                })
            }

            Producto.count({ disponible: true }, (error, conteo) => {

                res.json({
                    ok: true,
                    conteo,
                    productos
                })
            });
        })


});

/* Obtener un producto por ID */
app.get('/producto/:id', verificarToken, (req, res) => {
    //pupalate: usuario y categoria
    let id = req.params.id;
    Producto.findById(id, (error, productoBD) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se pudo encontrar producto con el ID solicitado"
                }
            })
        }

        return res.json({
            ok: true,
            productoBD
        })

    })


});


/* BUSCAR PRODUCTOS */
app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((error, productos) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "No se pudo encontrar producto con el ID solicitado"
                    }
                })
            }

            return res.json({
                ok: true,
                productos
            })
        })

})




/* Crear un nuevo producto */
app.post('/producto', verificarToken, (req, res) => {
    //grabar un user y categoria de las categorias que tenemos
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoriaId,
        usuario: req.usuario._id
    })

    producto.save((error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }
        res.json({
            ok: true,
            usuario: productoDB
        })

    })


});


/* Actualizar un producto */
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productoDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "No se pudo encontrar el producto con el ID solicitado"
                }
            })
        }

        return res.json({
            ok: true,
            productoDB
        })

    })

});

/* Desactivar un producto */
app.delete('/producto/:id', (req, res) => {
    //solo se cambia el estado del producto a false
    let id = req.params.id;


    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (error, producto) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto
        });

    })
})

module.exports = app;