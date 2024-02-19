const { createPool } = require('mysql2/promise');


 const pool = createPool({
    host: "127.0.0.1",
    port: 3306,
    user: 'root',
    password: 'Muni123',
    database: 'justicia',
});

module.exports = { pool}