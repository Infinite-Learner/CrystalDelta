const express = require('express');
const router = express.Router();
const { OrderProducts } = require('../controllers/OrderProducts');

router.post('/orders',OrderProducts);

module.exports = router; 