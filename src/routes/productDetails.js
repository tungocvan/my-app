const express = require('express');
const router = express.Router();

const productDetailsController = require('../app/controllers/ProductDetailsController');

router.get('/', productDetailsController.index);

module.exports = router;
