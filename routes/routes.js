const express = require('express');
const router = express.Router();

const { postNewPerson, getAllPersons, getPersonByIdentity, deletePerson } = require('../controller/persona.controller');
const { postImages, fileUpload } = require('../controller/imagen.controller');






router.get('/', (req, res) => {
  res.send('Welcome Justice');
});
router.get('/persona',getAllPersons);
router.post('/persona', postNewPerson);
router.get('/persona/identidad/:identidad', getPersonByIdentity)
router.delete('/persona/:id', deletePerson)

router.post('/images', fileUpload, postImages);
  

module.exports = router;
