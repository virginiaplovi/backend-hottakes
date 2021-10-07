const express = require('express');
const router = express.Router();

//IMPORT CONTROLLER
const userCtrl = require('../controllers/user');

//USER ROUTES ENDPOINT, CONTROLLER FUNCTIONS
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;