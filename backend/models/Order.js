const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: String,
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', orderSchema);