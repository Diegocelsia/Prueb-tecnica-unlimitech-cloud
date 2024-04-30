//MODULOS
const express = require("express") //crear rutas
const multer = require("multer")//Cargue de archivos
const path = require('path')//control de rutas
const fs = require("fs")//Juntar rutas


const router = express.Router()


//Conf para subir iamgen
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, "../images"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-monkeywit" + file.originalname)
    },
});

const fileUpload = multer({
    storage: diskstorage,
}).single("image"); //configurado para que cargue un solo archivo llamado image



router.get("/", (req, res) => {
    res.send("Aplicacion de imagenes")
}) //verificacion que hayan solicitudes ruta raiz


//cargue POST
router.post("/image/post", fileUpload, (req, res) => {

    req.getConnection((err, conn) => {//req.getConnection conecta al server
        if (err) return res.status(500).send("Error en el servidor")

        const type = req.file.mimetype
        const name = req.file.originalname
        const data = fs.readFileSync(path.join(__dirname, "../images/" + req.file.filename))

        conn.query("INSERT INTO image set ?", [{ type, name, data }], (err, rows) => {
            if (err) return res.status(500).send("Error en el servidor")

            res.send("Imagen guardada")
        })
    })
})


//Lectura GET, CARGUE DE ARCHIVO
router.get("/images/get", (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.status(500).send("Error en el servidor");

        conn.query("SELECT * FROM image", (err, rows) => { 
            if (err) return res.status(500).send("Error en el servidor");

            rows.map(img => {
                fs.writeFileSync(path.join(__dirname, '../dbimages/' + img.id + '-monkeywit.png'), img.data);
            })

            const imagedir = fs.readdirSync(path.join(__dirname, "../dbimages/"))

            res.json(imagedir)

            console.log(fs.readdirSync(path.join(__dirname, "../dbimages/")))
        })
    })
})


//Ruta delete
router.delete("/images/delete/:id", (req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send("Error en el servidor");

        conn.query("DELETE FROM image WHERE id = ?", [req.params.id], (err, rows) => { 
            if (err) return res.status(500).send("Error en el servidor")

            fs.unlinkSync(path.join(__dirname, "../dbimages/"+ req.params.id + "-monkeywit.png"))//Metodo para eliminar unlinkSync

            res.send("Imagen Eliminada")  
        })
    })
})




module.exports = router
