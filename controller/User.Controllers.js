const express = require('express');
const User = require('../models/User');

const enableCourseAfterPurchase = async (req, res) => {
    try {
        const { userId, coursesArray } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const courseMappings = {
            lmsPurchaseP1: 'lmsPurchaseP1',
            lmsPurchaseP2: 'lmsPurchaseP2',
            mindMapPurchaseP1: 'mindMapPurchaseP1',
            mindMapPurchaseP2: 'mindMapPurchaseP2',
            espPurchaseP1: 'espPurchaseP1',
            espPurchaseP2: 'espPurchaseP2',
            qbPurchaseP1: 'qbPurchaseP1',
            qbPurchaseP2: 'qbPurchaseP2',
        };

        coursesArray.forEach((course) => {
            if (courseMappings[course] !== undefined) {
                user[courseMappings[course]] = true;
            }
        });

        await user.save();
        console.log(
            `🚀 User : ${userId}, Purchased these Courses : ${coursesArray}  🎉`,
        );

        res.status(200).json(user);
    } catch (error) {
        // Handle the error appropriately, log or send an error response
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    enableCourseAfterPurchase,
};
