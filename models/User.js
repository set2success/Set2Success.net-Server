const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalLearned: { type: Number, default: 0 },
    idAdmin: { type: Boolean, default: 0 },
    lms_purchase: { type: Boolean, default: false },
    mindMap_purchase: { type: Boolean, default: false },
    esp_purchase: { type: Boolean, default: false },
    qb_purchase: { type: Boolean, default: false },
    userName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
});

module.exports = mongoose.model('User', userSchema);
