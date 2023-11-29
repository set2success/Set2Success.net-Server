const express = require('express');
const esp_json_data = require('./ESP_Practice_Data.json');
const ESPPracticeModel = require('../models/ESPPracticeModal');

// Get single course that contains the logged-in userId and specified courseName
const GetSingleCourseById = async (req, res) => {
    const { userId } = req.params;
    const { courseName } = req.query;

    try {
        if (!courseName) {
            return res.status(400).json({ error: 'CourseName is required' });
        }

        // Find the course that matches the specified user ID and course name
        const course = await ESPPracticeModel.findOne(
            { user: userId },
            { ESPPracticeExams: { $elemMatch: { courseName } } },
        );

        // let courses = [];
        // let course = await ESPPracticeModel.findOne({ user: userId });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course?.ESPPracticeExams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Middleware-friendly function to add new courses for a user
const addNewCoursesMiddleware = async (req, res, next) => {
    try {
        // User ID Handling:
        let userId;
        if (req.body.userId) {
            userId = req.body.userId;
        } else {
            userId = req.userId;
        }

        // Data Collection:
        const coursesJSON = esp_json_data.ESPPracticeExams;

        // Retrieve Existing Courses:
        let existingCourses = await ESPPracticeModel.findOne({
            user: userId,
        });

        // Create New Course Object if None Exists:
        if (!existingCourses) {
            existingCourses = new ESPPracticeModel({
                user: userId,
                ESPPracticeExams: [],
            });
        }

        // Filter New Courses:
        const newCourses = coursesJSON.filter((course) => {
            const doesCourseExist = existingCourses.ESPPracticeExams.some(
                (existingCourse) =>
                    existingCourse.courseName === course.courseName,
            );
            return !doesCourseExist;
        });

        // If there are no new courses to add, return a message
        if (newCourses.length === 0) {
            return res.status(401).json({
                message:
                    'All provided courses already exist for the current user',
            });
        }

        // Add New Courses to Existing Courses:
        existingCourses.ESPPracticeExams.push(...newCourses);

        // Save the updated courses
        const updatedCourses = await existingCourses.save();

        req.updatedCourses = updatedCourses; // Pass the result to the next middleware
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// export functions
module.exports = {
    GetSingleCourseById,
    addNewCoursesMiddleware,
};