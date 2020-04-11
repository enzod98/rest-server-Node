/* Puerto */
process.env.PORT = process.env.PORT || 3000


/* Entorno */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB = process.env.MONGO_URL;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}

//Esto es una variable de entorno que creamos manualmente
process.env.URLDB = urlDB;


/* OBS: Estas variables de entorno son creadas por NODE automáticamente en un entorno de producción, es por eso que de no existir le asignamos un valor y así identificamos cuando está en producción */


/* Vencimiento de nuestro TOKEN */
//60 segundos 60 minutos 24 horas 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


process.env.SEMILLA = process.env.SEMILLA || 'este-es-el-seed-desarrollo';