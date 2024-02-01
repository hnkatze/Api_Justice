const { v4:uuidv4 } = require('uuid');


export const postNewPerson = (req,res) =>{
    req.getConnection((err, conn) => {
        if (err) {
          console.error('Error en la conexión a la base de datos:', err);
          return res.status(500).json({ error: 'Error en el servidor al conectar a la base de datos' });
        }
        console.log('Datos recibidos:', req.body);
        const { nombre, apellido, direccion, identidad } = req.body;
    
        // Insertar datos de la persona en la base de datos
        const personaData = {
          personaId: uuidv4(), // Generar un nuevo ID
          nombre: nombre,
          apellido: apellido,
          direccion: direccion,
          identidad: identidad,
        };
        console.log(personaData);
        conn.query('INSERT INTO persona SET ?', personaData, (err) => {
          if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ error: 'Error en el servidor al insertar en la base de datos' });
          }
    
          // Obtener el ID generado
          const personaId = personaData.personaId;
          console.log(personaId);
          // Retornar el ID en la respuesta
          res.json({personaId: personaId});
        });
      });
}
export const getAllPersons = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error en la conexión a la base de datos:', err);
            return res.status(500).json({ error: 'Error en el servidor al conectar a la base de datos' });
        }

        conn.query('SELECT * FROM persona', (err, results) => {
            if (err) {
                console.error('Error al obtener datos de la base de datos:', err);
                return res.status(500).json({ error: 'Error en el servidor al obtener datos de la base de datos' });
            }

            res.json(results);
        });
    });
};
export const updatePerson = (req, res) => {
    const personaId = req.params.id;
    const updatedData = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error en la conexión a la base de datos:', err);
            return res.status(500).json({ error: 'Error en el servidor al conectar a la base de datos' });
        }

        conn.query('UPDATE persona SET ? WHERE personaId = ?', [updatedData, personaId], (err) => {
            if (err) {
                console.error('Error al actualizar en la base de datos:', err);
                return res.status(500).json({ error: 'Error en el servidor al actualizar en la base de datos' });
            }

            res.json({ message: 'Persona actualizada exitosamente' });
        });
    });
};
export const deletePerson = (req, res) => {
    const personaId = req.params.id;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error en la conexión a la base de datos:', err);
            return res.status(500).json({ error: 'Error en el servidor al conectar a la base de datos' });
        }

        conn.query('DELETE FROM persona WHERE personaId = ?', [personaId], (err) => {
            if (err) {
                console.error('Error al eliminar en la base de datos:', err);
                return res.status(500).json({ error: 'Error en el servidor al eliminar en la base de datos' });
            }

            res.json({ message: 'Persona eliminada exitosamente' });
        });
    });
};
export const getPersonByIdentity = (req, res) => {
    const identidad = req.params.identidad;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error en la conexión a la base de datos:', err);
            return res.status(500).json({ error: 'Error en el servidor al conectar a la base de datos' });
        }

        conn.query('SELECT * FROM persona WHERE identidad = ?', [identidad], (err, results) => {
            if (err) {
                console.error('Error al obtener datos de la base de datos:', err);
                return res.status(500).json({ error: 'Error en el servidor al obtener datos de la base de datos' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Persona no encontrada' });
            }

            res.json(results[0]);
        });
    });
};
