require('./config/config');

const express = require('express');
const app = express();
console.log(process);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());


app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            body
        });

    }

});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json(
        id
    );
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

app.listen(3000, () => {
    console.log('Esuchando el puerto: ', 3000);
})