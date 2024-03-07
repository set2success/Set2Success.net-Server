const express = require('express');
const bodyParser = require('body-parser');
const CartModel = require('../models/CartModal');
const { enableCourseAfterPurchase } = require('../controller/cart.controller');
const fetchCourseAndAdd = require('../controller/Courses.controller');

const app = express();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;

// app.use(bodyParser.raw({ type: 'application/json' }));
app.use(bodyParser.json());

// Middleware to parse JSON bodies
app.use(express.json());

// app.post('/webhooks', async (req, res) => {
//     // This is your Stripe CLI webhook secret for testing your endpoint locally.
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             sig,
//             STRIPE_ENDPOINT_SECRET,
//         );
//     } catch (err) {
//         // res.status(400).send(`Webhook Error: ${err.message}`);
//         console.log('error from stripe', err.message);
//         res.status(400).json({ success: false });
//         return;
//     }

//     // Handle the event
//     switch (event.type) {
//         // case 'payment_intent.succeeded':
//         case 'checkout.session.completed':
//             // payment.captured;
//             handleSuccessfulPayment(event);
//             break;
//         // Add more cases for other events if needed
//         default:
//             console.log(`Unhandled event type: ${event.type}`);
//     }

//     res.json({ success: true });
// });

app.post('/free-courses', async (req, res) => {
    const { userId, coursesArray } = req.body;
    const responseForEmptyCart = await emptyCart(userId);
    const enableCourse = await enableCourseAfterPurchase(userId, coursesArray);
    const addCourses = await fetchCourseAndAdd(userId, coursesArray);
    res.json({ message: 'success' });
});

app.post('/razorpay-webhook', (req, res) => {
    const secret = 'qJurcw9mBF68BsY';
    const crypto = require('crypto');
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));

    const jsonData =
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const notes = jsonData.payload.payment.entity.notes;

    if (!notes) {
        console.error('Notes object is undefined or null');
        // return res.status(400).json({ error: 'Invalid request body' });
    }

    const digest = shasum.digest('hex');
    // console.log(digest, req.headers['x-razorpay-signature']);
    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit ✅');

        if (notes) {
            handleSuccessfulPayment(notes);
        }

        // write response to file
        // require('fs').writeFileSync(
        //     'payment1.json',
        //     JSON.stringify(req.body, null, 4),
        // );
    } else {
        // pass it
    }
    res.json({ status: 'ok' });
});

function stringToArray(str) {
    return JSON.parse(str);
}

const handleSuccessfulPayment = async (notes) => {
    const { userId, coursesArray } = notes;
    const parsedArray = stringToArray(coursesArray);
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
