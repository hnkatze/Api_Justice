const { v4: uuidv4 } = require("uuid");

const postNewPerson = async (req, res) => {
  req.getConnection(async (err, conn) => {
    if (err) {
      console.error("Error en la conexión a la base de datos:", err);
      return res
        .status(500)
        .json({ error: "Error en el servidor al conectar a la base de datos" });
    }

    console.log("Datos recibidos:", req.body);
    const { nombre, apellido, direccion, identidad } = req.body;

    const personaData = {
      personaId: uuidv4(), // Generar un nuevo ID
      nombre: nombre,
      apellido: apellido,
      direccion: direccion,
      identidad: identidad,
    };
    try {
      const existingPerson = await getPersonIdentity(req, identidad);
      if (existingPerson) {
        return res.status(409).json({ message: "La persona ya existe" });
      }
      await conn.query("INSERT INTO persona SET ?", personaData);

      const personaId = personaData.personaId;
      console.log(personaId);
      res.json({ personaId: personaId });
    } catch (error) {
      console.error("Error al interactuar con la base de datos:", error);
      res
        .status(500)
        .json({
          error: "Error en el servidor al interactuar con la base de datos",
        });
    }
  });
};

const getAllPersons = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error en la conexión a la base de datos:", err);
      return res
        .status(500)
        .json({ error: "Error en el servidor al conectar a la base de datos" });
    }

    conn.query("SELECT * FROM persona", (err, results) => {
      if (err) {
        console.error("Error al obtener datos de la base de datos:", err);
        return res
          .status(500)
          .json({
            error: "Error en el servidor al obtener datos de la base de datos",
          });
      }

      res.json(results);
    });
  });
};
const updatePerson = (req, res) => {
  const personaId = req.params.id;
  const updatedData = req.body;

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error en la conexión a la base de datos:", err);
      return res
        .status(500)
        .json({ error: "Error en el servidor al conectar a la base de datos" });
    }

    conn.query(
      "UPDATE persona SET ? WHERE personaId = ?",
      [updatedData, personaId],
      (err) => {
        if (err) {
          console.error("Error al actualizar en la base de datos:", err);
          return res
            .status(500)
            .json({
              error: "Error en el servidor al actualizar en la base de datos",
            });
        }

        res.json({ message: "Persona actualizada exitosamente" });
      }
    );
  });
};
const deletePerson = (req, res) => {
  const personaId = req.params.id;

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error en la conexión a la base de datos:", err);
      return res
        .status(500)
        .json({ error: "Error en el servidor al conectar a la base de datos" });
    }

    conn.query(
      "DELETE FROM persona WHERE personaId = ?",
      [personaId],
      (err) => {
        if (err) {
          console.error("Error al eliminar en la base de datos:", err);
          return res
            .status(500)
            .json({
              error: "Error en el servidor al eliminar en la base de datos",
            });
        }

        res.json({ message: "Persona eliminada exitosamente" });
      }
    );
  });
};
const getPersonByIdentity = (req, res) => {
  const identidad = req.params.identidad;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error en la conexión a la base de datos:", err);
      return res
        .status(500)
        .json({ error: "Error en el servidor al conectar a la base de datos" });
    }

    conn.query(
      "SELECT * FROM persona WHERE identidad = ?",
      [identidad],
      (err, results) => {
        if (err) {
          console.error("Error al obtener datos de la base de datos:", err);
          return res
            .status(500)
            .json({
              error:
                "Error en el servidor al obtener datos de la base de datos",
            });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Persona no encontrada" });
        }

        res.json(results[0]);
      }
    );
  });
};
const getPersonIdentity = async (req, identidad) => {
  return new Promise((resolve, reject) => {
    req.getConnection((err, conn) => {
      if (err) {
        console.error("Error en la conexión a la base de datos:", err);
        reject("Error en el servidor al conectar a la base de datos");
      }

      conn.query(
        "SELECT * FROM persona WHERE identidad = ?",
        [identidad],
        (err, results) => {
          if (err) {
            console.error("Error al obtener datos de la base de datos:", err);
            reject("Error al obtener datos de la base de datos");
          }

          if (results.length === 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    });
  });
};

module.exports = {
  postNewPerson,
  getAllPersons,
  updatePerson,
  deletePerson,
  getPersonByIdentity,
};
