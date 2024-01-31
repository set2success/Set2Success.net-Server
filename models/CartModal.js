const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cartItems: [
            {
                item: { type: String, required: true },
                quantity: { type: Number, default: 1 },
                price: { type: Number, required: true },
            },
        ],
        courseArray: [],
    },
    { timestamps: true },
);

const CartModel = mongoose.model('cart', cartSchema);

module.exports = CartModel;
