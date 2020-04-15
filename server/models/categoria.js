const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de categoría es necesario']
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

module.exports = mongoose.model('Categoria', categoriaSchema);