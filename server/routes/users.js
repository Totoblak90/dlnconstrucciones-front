var express = require('express');
var router = express.Router();

// Importing API Users controller
const usersController = require('../controllers/usersController');

// Importing middleware for protected routes
const webTokenMiddleware = require('../middlewares/webTokenMiddleware');
const registrationValidate = require('../middlewares/registrationValidate');

/* GET home page. */
router.get('/', webTokenMiddleware, usersController.index);

router.post('/login', usersController.login);

router.post('/register', registrationValidate, usersController.register);

module.exports = router;
