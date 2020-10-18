const express = require('express');
const router = express.Router();

const loginRegisterController = require('../app/controllers/LoginRegisterController');

router.get('/', loginRegisterController.index);

module.exports = router;
