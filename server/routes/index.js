var express = require('express');
var router = express.Router();

// Importing API controllers
const indexController = require('../controllers/indexController');
const interestsController = require('../controllers/interestsController');
const servicesController = require('../controllers/servicesController');
const typesController = require('../controllers/typesController')
const jobsController = require('../controllers/jobsController');
const batchesController = require('../controllers/batchesController');
const categoriesController = require('../controllers/categoriesController');
const contactController = require('../controllers/contactController');

const contactValidate = require('../middlewares/contactValidate');

router.get('/interests', interestsController.index);

router.get('/services', servicesController.index);
router.get('/services/:id', servicesController.detail);

router.get('/types/', typesController.index);
router.get('/types/:id', typesController.detail);


router.get('/jobs', jobsController.index);
router.get('/jobs/:id', jobsController.detail);


router.get('/batches', batchesController.index);
router.get('/batches/:id', batchesController.detail);

router.get('/categories', categoriesController.index);
router.get('/categories/:id', categoriesController.detail);


router.get('/contact', contactController.index);
router.post('/contact', contactValidate, contactController.contact);

router.get('/', indexController.index);


module.exports = router;
