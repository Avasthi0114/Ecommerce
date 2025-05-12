const Cart = require('../models/Cart');
exports.getCart = async (req, res) => {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [] });
};
exports.updateCart = async (req, res) => {
    const { userId, items } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items });
    else cart.items = items;
    await cart.save();
    res.json(cart);
};