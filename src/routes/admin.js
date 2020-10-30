const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController');

router.post('/upload', AdminController.upload);
router.get('/menu', AdminController.menu);
router.get('/', AdminController.index);

module.exports = router;
