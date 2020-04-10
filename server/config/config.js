/* Puerto */
process.env.PORT = process.env.PORT || 3000


/* Entorno */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://esno:4ydIxbW6bvvel4uN@cluster0-kiv9c.mongodb.net/cafe';
}

//Esto es una variable de entorno que creamos manualmente
process.env.URLDB = urlDB;





/* OBS: Estas variables de entorno son creadas por NODE automáticamente en un entorno de producción, es por eso que de no existir le asignamos un valor y así identificamos cuando está en producción */