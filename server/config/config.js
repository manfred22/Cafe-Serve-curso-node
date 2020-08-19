// ====================
// Puerto
// ====================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento del Token
// ============================
//60 Segundos
//60 Minutos
//24 Horas
//30 Días
process.env.CADUCIDAD_TOKEN = '48h';

// ============================
//  SEED DE AUTENTICACION
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ====================
// Base de datos
// ====================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ====================
// GOOGLE CLIENT ID
// ====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '275131558001-gpdqf2768ab9mf77fnlr64bpso9ktiie.apps.googleusercontent.com';