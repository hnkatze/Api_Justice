
  import { pool, queries } from '../database';
  const uuid = require('uuid');
  
  export const getAllImagen = async (req, res) => {
    try {
      const [result] = await pool.execute(queries.getAllImagen);
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  export const getImagenById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await pool.execute(queries.getImagenById, [id]);
      if (result.length === 0) {
        return res.status(404).json({ msg: 'Imagen not found' });
      }
      res.json(result[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  export const createNewImagen = async (req, res) => {
    const { imagenPath, uploadDate, tags, personaId } = req.body;
    const imagenId = uuid.v4();
    if (!imagenPath || !uploadDate || !tags || !personaId) {
      return res.status(400).json({ msg: 'Bad Request. Please fill all fields' });
    }
  
    try {
      await pool.execute(queries.createNewImagen, [imagenPath, uploadDate, tags, personaId]);
      res.json({ imagenId });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  export const updateImagen = async (req, res) => {
    const { id } = req.params;
    const { imagenPath, uploadDate, tags, personaId } = req.body;
  
    if (!imagenPath || !uploadDate || !tags || !personaId) {
      return res.status(400).json({ msg: 'Bad Request. Please fill all fields' });
    }
  
    try {
      await pool.execute(queries.updateImagen, [imagenPath, uploadDate, tags, personaId, id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  export const deleteImagen = async (req, res) => {
    const { id } = req.params;
  
    try {
      await pool.execute(queries.deleteImagen, [id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  