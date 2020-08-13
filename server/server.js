require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index'));


try {
    mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE')
    });
} catch (error) {
    if (error) throw error;
    console.log('Base de datos OFFLINE')
}

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});