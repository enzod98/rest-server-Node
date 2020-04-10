const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

// En la siguiente línea definimos los roles permitidos de modo a hacer nuestra validación
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'], //Los valores que vamos a permitir
    message: '{VALUE} no es un rol válido' //Con {VALUE}, mongoose inyecta el valor que ingresó el usuario
}

/* 
    propiedad:{
        type: el tipo de variable que se espera (booleano, String, int, etc...)

        unique: sirve para especificar que esa propiedad debe ser única en la BD, funciona gracias al              plugin mongoose-unique-validator

        required: especifica si la propiedad es requerida o no, [boolean, 'Mensaje de error']

        default: el valor que por defecto tendrá nuestra propiedad
    }
*/

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'Debe ingresar una contraseña']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Este método se ejecuta siempre que hacemos una llamada a JSON del esquema
//Lo modificaremos para convertir nuestro JSON en un objeto y eliminar la propiedad password del mismo
usuarioSchema.methods.toJSON = function() {
    //Hay que aclarar que el .methods es propio del Mongoose para operar con schemas, no del Node
    let user = this;

    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

//Con la siguiente línea añadimos el plugin uniqueValidator al mongoose, esto sirve para emitir un mensaje de error personalizado cuando se está repitiendo el valor de un objeto que debe ser único en la BD
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
//mombreSchema.plugin.(nombreDePlugin, {message: '{PATH} mensaje'}) // El {PATH} sirve para que mongoose automáticamente inyecte en su lugar el nombre de nuestro atributo en conflicto

module.exports = mongoose.model('Usuario', usuarioSchema);