const express = require('express');
const bodyParser = require('body-parser');
const CartModel = require('../models/CartModal');
const { enableCourseAfterPurchase } = require('../controller/cart.controller');
const fetchCourseAndAdd = require('../controller/Courses.controller');

const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;

app.use(bodyParser.raw({ type: 'application/json' }));

app.post('/webhooks', async (req, res) => {
    // This is your Stripe CLI webhook secret for testing your endpoint locally.
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            STRIPE_ENDPOINT_SECRET,
        );
    } catch (err) {
        // res.status(400).send(`Webhook Error: ${err.message}`);
        console.log('error from stripe', err.message);
        res.status(400).json({ success: false });
        return;
    }

    // Handle the event
    switch (event.type) {
        // case 'payment_intent.succeeded':
        case 'checkout.session.completed':
            handleSuccessfulPayment(event);
            break;
        // Add more cases for other events if needed
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ success: true });
});

const handleSuccessfulPayment = async (event) => {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    const coursesArray = paymentIntent.metadata.coursesArray;
    const parsedArray = coursesArray.split(',');

    const responseForEmptyCart = await emptyCart(userId);
    const enableCourse = await enableCourseAfterPurchase(userId, parsedArray);
    const addCourses = await fetchCourseAndAdd(userId, parsedArray);
};

//emptyCart
const emptyCart = async (userId) => {
    try {
        const myCart = await CartModel.findOne({ user: userId });
        if (!myCart) {
            res.status(404).json({
                message: 'Cart not found',
            });
        }
        if (myCart) {
            myCart.cartItems = [];
            myCart.courseArray = [];
            await myCart.save();
            console.log(`🚀 User : ${userId}, Cart Emptied 🎉`);
            // res.status(200).json(myCart);
        }
    } catch (error) {
        console.error('Error deleting from cart:', error);
        // res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = app;
