const mongoose = require('mongoose');

const couponsSchema = new mongoose.Schema({
    couponCode: { type: String, required: true },
    amount: { type: Number, required: true },
    endDate: { type: Date, required: true },
    maxNumberUses: { type: Number, required: true },
});

module.exports = mongoose.model('CouponModal', couponsSchema);
