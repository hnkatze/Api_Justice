const { v4:uuidv4 } = require('uuid');
const path = require('path');
const multer = require('multer');


  const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, '../images'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const finalFileName = uniqueName + fileExtension;
    
    cb(null, finalFileName);
  }
});
export const fileUpload = multer({
  storage: diskStorage // Corregir el nombre del storage aquí
}).single('image');

  export const postImages = (req,res) => {
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
  
      conn.query('INSERT INTO imagen SET ?', imagenData, (err) => {
        if (err) return res.status(500).send('Server error' + err);
  
       const id = imagenData.imagenId
  
        res.json({id});
      });
    });
  } 