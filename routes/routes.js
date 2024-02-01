const { error } = require('console');
const express = require('express');
const { fs } = require('fs');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { v4:uuidv4 } = require('uuid');
const { postNewPerson } = require('../controller/persona.controller');


const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, '../images'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const finalFileName = uniqueName + fileExtension;
    
    cb(null, finalFileName);
  }
});

const fileUpload = multer({
  storage: diskStorage // Corregir el nombre del storage aquí
}).single('image');

router.get('/', (req, res) => {
  res.send('Welcome Justice');
});
router.get('/persona', (req, res) => {
  res.send('Welcome Persona');
});
router.post('/persona', postNewPerson);


router.post('/images', fileUpload, (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Server error' + err);
  
      const { originalname, filename } = req.file;
      const imagePath = path.join(__dirname, '../images', filename);
      const uploadDate = new Date(); // Puedes ajustar esto según tus necesidades
  
      // Obtener el personaId del cuerpo de la solicitud
      const personaId = req.body.personaId;
  
      // Insertar datos de la imagen en la base de datos
      const imagenData = {
        imagenId: uuidv4(), // Generar un nuevo ID
        imagenPath: imagePath,
        uploadDate: uploadDate,
        tags: req.body.tags, // Ajusta esto según tu formulario
        personaId: personaId, // Utilizar el personaId obtenido
      };
  
      conn.query('INSERT INTO imagen SET ?', imagenData, (err, row) => {
        if (err) return res.status(500).send('Server error' + err);
  
        // Hacer algo después de insertar en la base de datos, si es necesario
  
        res.send('Imagen subida exitosamente');
      });
    });
  });
  

module.exports = router;
