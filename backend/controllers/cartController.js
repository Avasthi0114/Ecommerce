const Cart = require('../models/Cart');

// Get cart items for a user
exports.getCart = async (req, res) => {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [] });
};

// Update the cart by adding/updating items
exports.updateCart = async (req, res) => {
    const { userId, items } = req.body;
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
        // If cart doesn't exist, create a new one
        cart = new Cart({ userId, items });
    } else {
        // If cart exists, update the items
        cart.items = items;
    }

    await cart.save();
    res.json(cart);
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    
    // Find the cart by userId
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    // Remove the item from the cart's items array
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    // Save the updated cart
    await cart.save();
    
    // Return the updated cart
    res.json(cart);
};
