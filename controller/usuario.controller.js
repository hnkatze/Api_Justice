const { pool } = require("../database/conections");
const { queries } = require("../database/queries");
const { v4: uuidv4 } = require("uuid");


const postNewUser = async (req, res) => {
    const { userName, password, role } = req.body;
    const userId = uuidv4();
    
    if (!userName || !password || !role) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios' });
    }
    
    try {
      // Comprobar si el nombre de usuario ya está en uso
      const [existingUser] = await pool.execute(queries.getUserByUserName, [userName]);
      if (existingUser.length > 0) {
        return res.status(409).json({ msg: 'El nombre de usuario ya está en uso' });
      }
  
      // Insertar el nuevo usuario
      await pool.execute(queries.createNewUser, [userId, userName, password, role]);
      res.json({ userId });
    } catch (error) {
      console.error("Error al crear un nuevo usuario:", error);
      res.status(500).send("Error al crear un nuevo usuario: " + error.message);
    }
  };
  const getAllUsers = async (req, res) => {
    try {
      const [results] = await pool.execute(queries.getAllUsers);
      res.json(results);
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      res.status(500).send("Error al obtener todos los usuarios: " + error.message);
    }
  };
  
  const getUserByUserName = async (req, res) => {
    const userName = req.params.userName;
    try {
      const [results] = await pool.execute(queries.getUserByUserName, [userName]);
      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(results[0]);
    } catch (error) {
      console.error("Error al obtener usuario por nombre de usuario:", error);
      res.status(500).send("Error al obtener usuario por nombre de usuario: " + error.message);
    }
  };
  const getUserByUserNameAndPassword = async (req, res) => {
    const { userName, password } = req.body;
    try {
      const [results] = await pool.execute(queries.getUserByUserNameAndPassword, [userName, password]);
      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const user = results[0];
      // Verifica si la contraseña proporcionada coincide con la contraseña almacenada en la base de datos
      if (password !== user.password) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
      // Si la contraseña es correcta, devuelve los datos del usuario
      res.json(user);
    } catch (error) {
      console.error("Error al obtener usuario por nombre de usuario y contraseña:", error);
      res.status(500).send("Error al obtener usuario por nombre de usuario y contraseña: " + error.message);
    }
  };
  
  const deleteUser = async (req, res) => {
    const userName = req.params.userName;
    try {
      const [result] = await pool.execute(queries.deleteUser, [userName]);
      if (result.affectedRows > 0) {
        res.status(200).send(`Usuario ${userName} eliminado con éxito.`);
      } else {
        res.status(404).send(`No se encontró un usuario con nombre de usuario ${userName}.`);
      }
    } catch (error) {
      console.error("Error al eliminar usuario por nombre de usuario:", error);
      res.status(500).send("Error al eliminar usuario por nombre de usuario: " + error.message);
    }
  };
  

  module.exports = {
    postNewUser,
    getAllUsers,
    getUserByUserName,
    deleteUser,
    getUserByUserNameAndPassword
  }