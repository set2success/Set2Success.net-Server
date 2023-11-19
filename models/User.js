const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalLearned: { type: Number, default: 0 },
    role: { type: Boolean, default: false },
    lms_purchase: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
