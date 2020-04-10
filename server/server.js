require('./config/config');


const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./controllers/usuario'))


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err
    else {
        console.log('Conexión exitosa a BD');
    }

});


app.listen(process.env.PORT, () => {
    console.log('Esuchando el puerto: ', process.env.PORT);
})