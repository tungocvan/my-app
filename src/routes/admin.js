const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController');

router.post('/upload', AdminController.upload);
router.post('/product', AdminController.updateProduct);
router.get('/menu', AdminController.menu);
router.get('/product/:id?', AdminController.product);
router.get('/', AdminController.index);
module.exports = router;
