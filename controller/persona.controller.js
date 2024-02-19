const { v4: uuidv4 } = require("uuid");
const { pool } = require("../database/conections");
const { queries } = require("../database/queries");


const postNewPerson = async (req, res) => {
    const { nombre, apellido, direccion, identidad } = req.body;
    const personaId = uuidv4();
    const [result] = await pool.execute(queries.getPersonaByIdentity, [identidad]);
   if(result.length == 1) return res.status(409).json({msg:'Ya Existe este Id'})
    try {
      await  pool.execute(queries.createNewPersona,[personaId, nombre,apellido,direccion,identidad]);
      res.json({personaId});
    } catch (error) {
    res.status(500).send(error.message)
    }
};

const getAllPersons = async (req, res) => {
  try{
const [result] = await pool.execute(queries.getAllPersona);
res.json(result);

  }catch(err){res.status(500).send(err.message)}
 
};
const updatePerson = async (req, res) => {
  const { personaId, nombre, apellido, direccion, identidad } = req.body;
  if (!personaId || !nombre || !identidad) {
    return res.status(400).json({ msg: 'Bad Request: Faltan Campos' });
  }
  try {
    await pool.execute(queries.updatePersona, [nombre, apellido, direccion, identidad, personaId]);
    res.json({ personaId });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deletePerson = async (req, res) => {
  const { personaId } = req.params;
  if (!personaId) {
    return res.status(400).json({ msg: 'Bad Request: Se requiere personaId' });
  }
  try {
    await pool.execute(queries.deletePersona, [personaId]);
    res.json({ msg: 'Persona eliminada exitosamente' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPersonByIdentity = async (req, res) => {
  const { identidad } = req.params;
  if (!identidad) {
    return res.status(400).json({ msg: 'Bad Request: Se requiere identidad' });
  }
  try {
    const [result] = await pool.execute(queries.getPersonaByIdentity, [identidad]);
    if (result.length === 0) {
      return res.status(404).json({ msg: 'Persona no encontrada' });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  postNewPerson,
  getAllPersons,
  updatePerson,
  deletePerson,
  getPersonByIdentity,
};
