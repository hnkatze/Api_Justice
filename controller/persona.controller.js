


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
        conn.query('INSERT INTO persona SET ?', personaData, (err, result) => {
          if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ error: 'Error en el servidor al insertar en la base de datos' });
          }
    
          // Obtener el ID generado
          const personaId = personaData.personaId;
          console.log(personaId);
          // Retornar el ID en la respuesta
          res.json({ ok: true, personaId: personaId, message: 'Persona registrada exitosamente' });
        });
      });
}