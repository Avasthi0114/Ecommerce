const express = require('express');
const router = express.Router();
const { getCart, updateCart } = require('../controllers/cartController');
router.get('/:userId', getCart);
router.post('/update', updateCart);
module.exports = router;