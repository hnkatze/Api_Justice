const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors())
app.use(require('./routes/routes'));
app.use(express.urlencoded({extended:false}));

app.listen(3007, () => {
  console.log('El servidor está en ejecución en', 'http:/localhost:' + 3007);
});
