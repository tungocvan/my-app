const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController');

router.get('/menuTop/:id?', AdminController.menuTop);
router.get('/order/:id?', AdminController.order);
router.get('/account/:id?', AdminController.account);
router.get('/post/:id?', AdminController.post);
router.get('/updateProduct/:id?', AdminController.updateProduct);
router.get('/productDelete/:id?', AdminController.productDelete);
router.get('/categoryDelete/:id?', AdminController.categoryDelete);
router.post('/upload', AdminController.upload);
router.post('/product', AdminController.createProduct);
router.post('/category/:id?', AdminController.createCategory);
router.post('/updateProduct', AdminController.updateProductById);
router.get('/copyProduct/:id?', AdminController.copyProduct);
router.get('/menu', AdminController.menu);
router.get('/product/:id?/:slug?', AdminController.product);
router.get('/', AdminController.index);
module.exports = router;
