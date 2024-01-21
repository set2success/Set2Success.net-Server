const express = require('express');
const CartModel = require('../models/CartModal');
const AddToCart = async (req, res) => {
    try {
        const { userId, itemName, price, quantity } = req.body;
        const myCart = await CartModel.findOne({ user: userId });

        if (!myCart) {
            const newCart = new CartModel({
                user: userId,
                cartItems: [],
            });
            newCart.cartItems.push({
                item: itemName,
                price: price,
                quantity: quantity,
            });
            await newCart.save();
            res.status(200).json(newCart);
        }

        if (myCart) {
            const itemIndex = myCart.cartItems.findIndex(
                (p) => p.item === itemName,
            );
            if (itemIndex > -1) {
                let cartItem = myCart.cartItems[itemIndex];
                cartItem.price = price;
                cartItem.quantity = quantity;
                myCart.cartItems[itemIndex] = cartItem;
            } else {
                myCart.cartItems.push({
                    item: itemName,
                    price: price,
                    quantity: quantity,
                });
            }
            await myCart.save();
            res.status(200).json(myCart);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const ReadCart = async (req, res) => {
    // CartModel.findOne({ userId: userId })
    //     .then((cart) => {
    //         res.status(200).json(cart);
    //     })
    //     .catch((err) => {
    //         res.status(500).json({
    //             message: 'Error finding cart',
    //             error: err.message,
    //         });
    //     });

    try {
        const { userId } = req.query;
        const myCart = await CartModel.findOne({ user: userId });
        if (!myCart) {
            res.status(404).json({
                message: 'Cart not found',
            });
        }
        if (myCart) {
            res.status(200).json(myCart);
        }
    } catch (error) {
        console.error('Error deleting from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// DeleteCartItemByName
const DeleteCartItemByName = async (req, res) => {
    try {
        const { userId, itemName } = req.body;
        const myCart = await CartModel.findOne({ user: userId });
        if (!myCart) {
            res.status(404).json({
                message: 'Cart not found',
            });
        }
        if (myCart) {
            const itemIndex = myCart.cartItems.findIndex(
                (p) => p.item === itemName,
            );
            if (itemIndex > -1) {
                myCart.cartItems.splice(itemIndex, 1);
            }
            await myCart.save();
            res.status(200).json(myCart);
        }
    } catch (error) {
        console.error('Error deleting from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export functions
module.exports = {
    AddToCart,
    ReadCart,
    DeleteCartItemByName,
};
