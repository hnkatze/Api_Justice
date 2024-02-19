const express = require('express');
const router = express.Router();
const { postNewPerson, getAllPersons, getPersonByIdentity, deletePerson } = require('../controller/persona.controller');
const { postImages, fileUpload, getAllImages, getImageById, getImagesByTags, deleteImageById, getImageByPersonId } = require('../controller/imagen.controller');
const { deleteUser, postNewUser, getUserByUserName, getAllUsers, getUserByUserNameAndPassword } = require('../controller/usuario.controller');


router.get('/', (req, res) => {
  res.send('Welcome Justice');
});
router.get('/persona',getAllPersons);
router.post('/persona', postNewPerson);
router.get('/persona/identidad/:identidad', getPersonByIdentity);
router.delete('/persona/:id', deletePerson);

router.post('/images', fileUpload, postImages);
router.get('/images', getAllImages);
router.get('/images/:imagenId', getImageById);
router.get('/images/tags/:tags', getImagesByTags);
router.get('/images/personaId/:personaId', getImageByPersonId);
router.delete('/images/:id', deleteImageById);

router.get('/users', getAllUsers);
router.get('/users/:userName', getUserByUserName);
router.post('/users', postNewUser);
router.delete('/users/:userName', deleteUser);
router.post('/login',getUserByUserNameAndPassword)

module.exports = router;
