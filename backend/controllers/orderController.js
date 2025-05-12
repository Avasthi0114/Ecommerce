const Order = require('../models/Order');
exports.createOrder = async (req, res) => {
    const { userId, items, totalAmount } = req.body;
    const newOrder = new Order({ userId, items, totalAmount });
    await newOrder.save();
    res.status(201).json(newOrder);
};
exports.getUserOrders = async (req, res) => {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    res.json(orders);
};
