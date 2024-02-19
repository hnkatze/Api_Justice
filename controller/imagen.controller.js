const { v4: uuidv4 } = require("uuid");
const path = require("path");
const multer = require("multer");
const { pool } = require("../database/conections");
const { queries } = require("../database/queries");

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
  storage: diskStorage, 
}).single("image");

const postImages = async (req, res) => {
  const { filename } = req.file;
  const imagePath = path.join(filename);
  const uploadDate = new Date(); 


  const { personaId, tags } = req.body;

  try {

    const imagenId = uuidv4();
    await pool.execute(queries.createNewImagen, [imagenId, imagePath, uploadDate, tags, personaId]);

    res.json({ id: imagenId });
  } catch (error) {
    console.error("Error al insertar imagen en la base de datos:", error);
    res.status(500).send("Error al insertar imagen en la base de datos: " + error.message);
  }
};


const getAllImages = async (req, res) => {
  try {
    const [results] = await pool.execute(queries.getAllImagen);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener todas las imágenes:", error);
    res.status(500).send("Error al obtener todas las imágenes: " + error.message);
  }
};

const getImageById = async (req, res) => {
  const imagenId = req.params.imagenId;
  try {
    const [results] = await pool.execute(queries.getImagenById, [imagenId]);
    if (results.length === 0) {
      console.log(`No se encontraron resultados para imagenId: ${imagenId}`);
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    console.log(`Resultados encontrados para imagenId: ${imagenId}`);
    res.json(results[0]);
  } catch (error) {
    console.error("Error al obtener imagen por ID:", error);
    res.status(500).send("Error al obtener imagen por ID: " + error.message);
  }
};

const getImageByPersonId = async (req, res) => {
  const personaId = req.params.personaId;
  try {
    const [results] = await pool.execute(queries.getImagenByIdentity, [personaId]);
    if (results.length === 0) {
      console.log(`No se encontraron imágenes para personaId: ${personaId}`);
      return res.status(404).json({ message: "No se encontraron imágenes para la persona" });
    }
    res.json(results);
  } catch (error) {
    console.error("Error al obtener imágenes por personaId:", error);
    res.status(500).send("Error al obtener imágenes por personaId: " + error.message);
  }
};

const getImagesByTags = async (req, res) => {
  const tags = req.params.tags.split(",");
  try {
    const [results] = await pool.execute(queries.getImagesByTags, [tags]);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener imágenes por tags:", error);
    res.status(500).send("Error al obtener imágenes por tags: " + error.message);
  }
};

const deleteImageById = async (req, res) => {
  const imagenId = req.params.id;
  try {
    const [result] = await pool.execute(queries.deleteImagen, [imagenId]);
    if (result.affectedRows > 0) {
      res.status(200).send(`Imagen con ID ${imagenId} eliminada con éxito.`);
    } else {
      res.status(404).send(`No se encontró una imagen con ID ${imagenId}.`);
    }
  } catch (error) {
    console.error("Error al eliminar imagen por ID:", error);
    res.status(500).send("Error al eliminar imagen por ID: " + error.message);
  }
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
