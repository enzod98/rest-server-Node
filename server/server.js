require('./config/config');


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

const bodyParser = require('body-parser');


//Habilitar el public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuración global de rutas

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./controllers/indexControllers'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err
    else {
        console.log('Conexión exitosa a BD');
    }

});


app.listen(process.env.PORT, () => {
    console.log('Esuchando el puerto: ', process.env.PORT);
})