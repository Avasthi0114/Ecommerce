const express = require('express');
const router = express.Router();
const { getCart, updateCart, removeFromCart } = require('../controllers/cartController');

// Get cart for a specific user
router.get('/:userId', getCart);

// Update the cart (add/update items)
router.post('/update', updateCart);

// Remove an item from the cart
router.post('/remove', removeFromCart);

module.exports = router;
