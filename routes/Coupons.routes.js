const express = require('express');
const couponsRouter = express();

const couponController = require('../controller/Coupons.controller');

couponsRouter.post('/create-coupon', couponController.createCoupon);
couponsRouter.post('/verify-coupon', couponController.verifyCoupon);
couponsRouter.get('/get-coupons', couponController.getCoupons);
couponsRouter.delete('/delete-coupon/:couponId', couponController.deleteCoupon);

module.exports = couponsRouter;
