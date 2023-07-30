var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', userController.getUserInfo);

module.exports = router;
