const express = require('express');
const CouponModal = require('../models/Coupons');

const createCoupon = async (req, res) => {
    try {
        const { couponCode, amount, endDate, maxNumberUses } = req.body;
        // check if coupon already exists
        const existingCoupon = await CouponModal.findOne({ couponCode });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon already exists' });
        }
        const newCoupon = new CouponModal({
            couponCode,
            amount,
            endDate,
            maxNumberUses,
        });
        await newCoupon.save();
        res.status(200).json(newCoupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// verify coupon
const verifyCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const existingCoupon = await CouponModal.findOne({ couponCode });
        if (!existingCoupon) {
            return res.status(200).json({ message: 'Invalid coupon' });
        }
        // check if coupon is expired
        const currentDate = new Date();
        if (currentDate > existingCoupon.endDate) {
            return res.status(200).json({ message: 'Coupon expired' });
        }
        // check if coupon has been used more than the maximum number of uses
        if (existingCoupon.maxNumberUses <= 0) {
            return res.status(200).json({ message: 'Coupon exhausted' });
        }
        // decrement the number of uses
        existingCoupon.maxNumberUses -= 1;
        await existingCoupon.save();
        // if coupon is valid, return discount
        res.status(200).json({
            message: 'Coupon verified',
            discount: existingCoupon.amount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getCoupons = async (req, res) => {
    try {
        const coupons = await CouponModal.find();
        res.status(200).json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        await CouponModal.findByIdAndDelete(couponId);
        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createCoupon,
    verifyCoupon,
    getCoupons,
    deleteCoupon,
};
