const express = require('express');
const _ = require('underscore');

let { verificaToken, verficaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', (req, res) => {
    Categoria.find({ estado: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categorias) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }


            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    existen: conteo
                })
            });
        })
});

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'usuario'])

    Categoria.findById(id, body, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let usuario = req.usuario._id
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Editar la categoria
// ============================
app.put('/categoria/:id', /*  [verificaToken, verficaAdmin_Role], */ (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion,
        estado: body.estado
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Eliminar una categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verficaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    });
})

/* app.delete('/categoria/:id', [verificaToken, verficaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    });
}) */


module.exports = app;