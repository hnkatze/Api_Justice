 const queries = {
    getAllImagen: "SELECT * FROM imagen",
    getImagenById: "SELECT * FROM imagen WHERE imagenId = ?",
    getImagenByIdentity: "SELECT * FROM imagen WHERE personaId = ?",
    createNewImagen: "INSERT INTO imagen (imagenId, imagenPath, uploadDate, tags, personaId) VALUES (?, ?, ?, ?, ?)",
    updateImagen: "UPDATE imagen SET imagenPath = ?, uploadDate = ?, tags = ?, personaId = ? WHERE imagenId = ?",
    deleteImagen: "DELETE FROM imagen WHERE imagenId = ?",
    getAllPersona: "SELECT * FROM persona",
  getPersonaById: "SELECT * FROM persona WHERE personaId = ?",
  getPersonaByIdentity: "SELECT * FROM persona WHERE identidad = ?",
  createNewPersona: "INSERT INTO persona (personaId, nombre, apellido, direccion, identidad) VALUES (?, ?, ?, ?, ?)",
  updatePersona: "UPDATE persona SET nombre = ?, apellido = ?, direccion = ?, identidad = ? WHERE personaId = ?",
  deletePersona: "DELETE FROM persona WHERE personaId = ?",
  createNewUser: "INSERT INTO usuarios (userId, userName, password, role) VALUES (?, ?, ?, ?)",
  getAllUsers: "SELECT userId,userName, role FROM usuarios",
  getUserByUserName: "SELECT userName, role FROM usuarios WHERE userName = ?",
  getUserByUserNameAndPassword: "SELECT * FROM usuarios WHERE userName = ? AND password = ?",
  deleteUser: "DELETE FROM usuarios WHERE userName = ?"
  };

  module.exports = {
    queries
  }