const express = require('express');
const router = express.Router();

const checkoutController = require('../app/controllers/CheckoutController');

router.post('/payment', checkoutController.payment);
router.get('/', checkoutController.index);

module.exports = router;
