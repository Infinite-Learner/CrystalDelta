const express = require('express');
const router = express.Router();
const { getProducts, getProduct , getProductsByCategory  } = require('../controllers/getProducts');

router.get('/products',getProducts);
router.get('/product/:id',getProduct);
router.get('/products/category/:category',getProductsByCategory);
module.exports = router; 