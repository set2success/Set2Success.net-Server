const express = require('express');
const cartRouter = express();

const cartController = require('../controller/cart.controller');

cartRouter.post('/setCartItems', cartController.AddToCart);

cartRouter.get('/getCartItems', cartController.ReadCart);

cartRouter.post('/deleteItemByItemName/', cartController.DeleteCartItemByName);

module.exports = cartRouter;