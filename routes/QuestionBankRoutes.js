const express = require('express');
const QuestionBankRouter = express();
const QuestionBankController = require('../controller/QuestionBank.controller');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const SESSION_PASSWORD = process.env.SESSION_PASSWORD;

// Middleware to check if the user is already logged in
function checkUserLoggedIn(req, res, next) {
    // Parse cookies from the request
    const cookies = cookie.parse(req.headers.cookie || '');

    // Retrieve the 'token' cookie
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // Verify the token
    jwt.verify(token, SESSION_PASSWORD, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token not verified' });
        }

        // Token is valid, user is already logged in
        req.userId = decoded.id;
        next();
    });
}

// Get single course that contains the logged-in userId and specified courseName
QuestionBankRouter.get(
    '/all-courses/user/:userId',
    QuestionBankController.GetSingleCourseById,
);

// Set data to dataBase
QuestionBankRouter.post(
    '/addNewCourses',
    checkUserLoggedIn,
    QuestionBankController.addNewCoursesMiddleware,
    (req, res) => {
        res.status(201).json(req.updatedCourses);
    },
);

// Post: submitResult
QuestionBankRouter.post(
    '/statistics',
    QuestionBankController.SubmitStatistics,
    (req, res) => {
        res.status(201).json(req.updatedCourses);
    },
);

// Get: submitResult
QuestionBankRouter.get('/statistics', QuestionBankController.GetStatistics);

module.exports = QuestionBankRouter;
