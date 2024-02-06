const { v4: uuidv4 } = require("uuid");
const path = require("path");
const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    const uniqueName = Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const finalFileName = uniqueName + fileExtension;

    cb(null, finalFileName);
  },
});
const fileUpload = multer({
  storage: diskStorage, // Corregir el nombre del storage aquí
}).single("image");

const postImages = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Server error" + err);

    const { filename } = req.file;
    const imagePath = path.join(filename);
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
    conn.query("INSERT INTO imagen SET ?", imagenData, (err) => {
      if (err) return res.status(500).send("Server error" + err);

      const id = imagenData.imagenId;

      res.json({ id });
    });
  });
};

const getAllImages = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Server error" + err);

    conn.query("SELECT * FROM imagen", (err, results) => {
      if (err) return res.status(500).send("Server error" + err);

      res.json(results);
    });
  });
};

const getImageById = (req, res) => {
  const imagenId = req.params.imagenId;

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error de conexión a la base de datos:", err);
      return res.status(500).send("Error de conexión a la base de datos");
    }

    const query = "SELECT * FROM imagen WHERE imagenId = ?";
    conn.query(query, [imagenId], (err, results) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res.status(500).send("Error al ejecutar la consulta");
      }

      if (results.length === 0) {
        console.log(`No se encontraron resultados para imagenId: ${imagenId}`);
        return res.status(404).json({ message: "Imagen no encontrada" });
      }

      console.log(`Resultados encontrados para imagenId: ${imagenId}`);
      res.json(results[0]); // Devuelve solo el primer resultado
    });
  });
};

const getImageByPersonId = (req, res) => {
  const personaId = req.params.personaId;

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al obtener imagen por personaId:", err);
      return res.status(500).send("Error del servidor");
    }

    conn.query(
      "SELECT * FROM imagen WHERE personaId = ?",
      [personaId],
      (err, results) => {
        if (err) {
          console.error("Error al obtener imagen por personaId:", err);
          return res.status(500).send("Error del servidor");
        }

        if (results.length === 0) {
          return res.status(500).send("Error al obtener La Imagen");
        }
        console.log(res);
        res.json(results);
      }
    );
  });
};

const getImagesByTags = (req, res) => {
  const tags = req.params.tags.split(",");

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Server error" + err);

    const query = "SELECT * FROM imagen WHERE FIND_IN_SET(?, tags)";

    conn.query(query, [tags], (err, results) => {
      if (err) return res.status(500).send("Server error" + err);

      res.json(results);
    });
  });
};

const deleteImageById = (req, res) => {
  const imagenId = req.params.id;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send("Server error" + err);

    conn.query(
      "DELETE FROM imagen WHERE imagenId = ?",
      [imagenId],
      (err, result) => {
        if (err) return res.status(500).send("Server error" + err);

        if (result.affectedRows > 0) {
          res
            .status(200)
            .send(`Imagen con ID ${imagenId} eliminada con éxito.`);
        } else {
          res.status(404).send(`No se encontró una imagen con ID ${imagenId}.`);
        }
      }
    );
  });
};

module.exports = {
  fileUpload,
  postImages,
  getAllImages,
  getImageById,
  getImagesByTags,
  deleteImageById,
  getImageByPersonId,
};
