const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: 0 },

    lmsPurchaseP1: { type: Boolean, default: false },
    lmsPurchaseP2: { type: Boolean, default: false },

    mindMapPurchaseP1: { type: Boolean, default: false },
    mindMapPurchaseP2: { type: Boolean, default: false },

    espPurchaseP1: { type: Boolean, default: false },
    espPurchaseP2: { type: Boolean, default: false },

    qbPurchaseP1: { type: Boolean, default: false },
    qbPurchaseP2: { type: Boolean, default: false },

    userName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
});

module.exports = mongoose.model('User', userSchema);
