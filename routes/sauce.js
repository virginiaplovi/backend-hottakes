const express = require('express');
const router = express.Router();

//IMPORT MIDDLEWARE
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//IMPORT CONTROLLER
const sauceCtrl = require('../controllers/sauce');

//SAUCE ROUTES ENDPOINT, CONTROLLER FUNCTIONS
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.addSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;