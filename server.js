const express = require('express');
const mysql = require('mysql'); // Cambiado a mysql
const myconn = require('express-myconnection');
const app = express();
const cors = require('cors')

app.use(
  myconn(mysql, {
    host: "127.0.0.1",
    port: 3306,
    user: 'root',
    password: 'Muni123',
    database: 'justicia',
  })
);

app.use(express.json());
app.use(cors())
app.use(require('./routes/routes'));

app.listen(3007, () => {
  console.log('El servidor está en ejecución en', 'http:/localhost:' + 3007);
});
