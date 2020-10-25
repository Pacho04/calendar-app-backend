/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

//Crear el servidor de express
const app = express();

//Base de Datos
dbConnection();

//CORS
app.use(cors());

//Directorio Publico
app.use( express.static('public') )

//Lectura del Body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));

//Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo');
});

