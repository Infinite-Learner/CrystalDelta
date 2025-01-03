const express = require('express');
const router = express.Router();
const { OrderProducts ,getOrders} = require('../controllers/OrderProducts');

router.post('/orders',OrderProducts);
router.get('/orders/:id',getOrders);

module.exports = router; 