const express = require('express');
const cartRouter = express();

const cartController = require('../controller/cart.controller');

cartRouter.post('/setCartItems', cartController.AddToCart);

cartRouter.get('/getCartItems', cartController.ReadCart);

cartRouter.post('/deleteItemByItemName/', cartController.DeleteCartItemByName);

cartRouter.post('/payment', cartController.PaymentRazorpay);

cartRouter.post('/payment-validate', cartController.paymentVerifySignature);

// cartRouter.post('/enableCourse', cartController.Payment);

module.exports = cartRouter;
