// Dependencias
const express = require('express')//crear rutas
const mysql = require("mysql")//conecta a la base
const myconn = require("express-myconnection")//simplifica coneccion
const cors = require("cors")//comunicacion front y back
const path = require('path')//control de rutas


const app = express()

app.use(myconn(mysql, {
    host:"localhost",
    port: 3306,
    user: "root",
    password: "199725",
    database: "images"
}))

app.use(cors())//Ojo, leer documentacion. profundizar el tema porque comunica el front con el back
app.use(express.static(path.join(__dirname, "dbimages")))//carpeta definida para archivos temporales.


app.use(require('./routes/routes'))

app.listen(9000, () => {
    console.log('Escuchando servidor el puerto ', 'http://localhost:' + 9000);
})


