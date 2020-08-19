const express = require('express');
const _ = require('underscore');
let { verificaToken, verficaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
const categoria = require('../models/categoria');


// ============================
// Mostrar todos los productos
// ============================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    stock: conteo
                })
            });
        });

    //Todos
    //populate: usuario categoria
    //paginado
});

// ============================
// Mostrar un producto
// ============================
app.get('/productos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'disponible', 'categoria', 'usuario']);

    Producto.findById(id, body)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })

    //populate: usuario categoria
});

// ============================
// Buscar productos
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });


});


// ============================
// Crear un nuevo producto
// ============================
app.post('/productos', [verificaToken, verficaAdmin_Role], (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
});

// ============================
// Actualizar un producto
// ============================
app.put('/productos/:id', [verificaToken, verficaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    /* let descProductos = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    } */

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe.'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.descripcion = body.descripcion;
        productoDB.precioUni = body.precioUni;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });

    //Producto.findByIdAndUpdate(id, descProductos, { new: true, runValidators: true }, (err, productoDB) => {
    //    if (err) {
    //        return res.status(500).json({
    //            ok: false,
    //            err
    //        });
    //    }

    //    if (!productoDB) {
    //        return res.status(400).json({
    //            ok: false,
    //            err: 'El ID no existe'
    //        });
    //    }


    //    res.json({
    //        ok: true,
    //        producto: productoDB
    //    });
    //});
});

// ============================
// Borrar un producto
// ============================
app.delete('/productos/:id', (req, res) => {
    //disponible => false
    let id = req.params.id;
    let cambioDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambioDisponible, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no disponible'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            mensaje: 'Producto Borrado'
        })
    })
});










module.exports = app;