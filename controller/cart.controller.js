const express = require('express');
const CartModel = require('../models/CartModal');
const User = require('../models/User');
const fetchCourseAndAdd = require('./Courses.controller');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;

const AddToCart = async (req, res) => {
    try {
        const { userId, itemName, price, quantity, courseName } = req.body;
        const myCart = await CartModel.findOne({ user: userId });

        if (!myCart) {
            const newCart = new CartModel({
                user: userId,
                cartItems: [],
                courseArray: [],
            });
            newCart.cartItems.push({
                item: itemName,
                price: price,
                quantity: quantity,
            });
            newCart.courseArray.push(courseName);
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

            // check is it already in the courseArray
            const courseIndex = myCart.courseArray.findIndex(
                (p) => p === courseName,
            );
            if (courseIndex > -1) {
                let cartItem = myCart.courseArray[courseIndex];
                myCart.courseArray[courseIndex] = cartItem;
            } else {
                myCart.courseArray.push(courseName);
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
        const { userId, itemName, courseName } = req.body;
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

            // check is it already in the courseArray
            const courseIndex = myCart.courseArray.findIndex(
                (p) => p === courseName,
            );
            if (courseIndex > -1) {
                myCart.courseArray.splice(courseIndex, 1);
            }

            await myCart.save();
            res.status(200).json(myCart);
        }
    } catch (error) {
        console.error('Error deleting from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Payment
const Payment = async (req, res) => {
    try {
        const { userId, cartItems, coursesArray } = req.body;

        const lineItems = cartItems.map((product) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.item,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: product.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            // payment_method_types: [
            //     'card', // Credit or debit cards
            //     'alipay', // Alipay
            //     'ideal', // iDEAL
            //     // Add more payment methods as needed
            // ],
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${FRONTEND_URL}/purchase-success`,
            cancel_url: `${FRONTEND_URL}/purchase-failed`,
            metadata: {
                userId: String(userId),
                coursesArray: String(coursesArray),
            },
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error('Error deleting from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const enableCourseAfterPurchase = async (userId, coursesArray) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const courseMappings = {
            lmsPurchaseP1: 'lmsPurchaseP1',
            lmsPurchaseP2: 'lmsPurchaseP2',
            mindMapPurchaseP1: 'mindMapPurchaseP1',
            mindMapPurchaseP2: 'mindMapPurchaseP2',
            espPurchaseP1: 'espPurchaseP1',
            espPurchaseP2: 'espPurchaseP2',
            qbPurchaseP1: 'qbPurchaseP1',
            qbPurchaseP2: 'qbPurchaseP2',
        };

        coursesArray.forEach((course) => {
            if (courseMappings[course] !== undefined) {
                user[courseMappings[course]] = true;
            }
        });

        await user.save();
        console.log(
            `🚀 User: ${userId}, Purchased these Courses: ${coursesArray}  🎉`,
        );
        return user;
    } catch (error) {
        throw new Error(`Error enabling courses: ${error.message}`);
    }
};

// export functions
module.exports = {
    AddToCart,
    ReadCart,
    DeleteCartItemByName,
    Payment,
    enableCourseAfterPurchase,
};
