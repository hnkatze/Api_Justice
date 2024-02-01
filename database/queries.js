export const queries = {
    getAllImagen: "SELECT * FROM imagen",
    getImagenById: "SELECT * FROM imagen WHERE imagenId = ?",
    createNewImagen: "INSERT INTO imagen (imagenPath, uploadDate, tags, personaId) VALUES (?, ?, ?, ?)",
    updateImagen: "UPDATE imagen SET imagenPath = ?, uploadDate = ?, tags = ?, personaId = ? WHERE imagenId = ?",
    deleteImagen: "DELETE FROM imagen WHERE imagenId = ?",
    getAllPersona: "SELECT * FROM persona",
  getPersonaById: "SELECT * FROM persona WHERE personId = ?",
  createNewPersona: "INSERT INTO persona (nombre, apellido, direccion, identidad) VALUES (?, ?, ?, ?)",
  updatePersona: "UPDATE persona SET nombre = ?, apellido = ?, direccion = ?, identidad = ? WHERE personId = ?",
  deletePersona: "DELETE FROM persona WHERE personId = ?",
  };