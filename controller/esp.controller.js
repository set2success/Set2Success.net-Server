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

        console.log('New Courses Added [ESP] ✅');
        req.updatedCourses = updatedCourses; // Pass the result to the next middleware
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Save question by id
const SaveQuestionById = async (req, res) => {
    const { questionId } = req.query;
    console.log('question id: ' + questionId);

    // User ID Handling:
    let userId;
    if (req.body.userId) {
        userId = req.body.userId;
    } else {
        userId = req.userId;
    }

    if (!questionId) {
        return res.status(400).json({ error: 'Question ID is required' });
    }

    try {
        const course = await ESPPracticeModel.findOne({ user: userId });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const savedQuestionsArray = course?.ESPPracticeExams[0]?.savedQuestions;

        const isQuestionSaved = savedQuestionsArray.includes(questionId);

        const updateOperation = isQuestionSaved
            ? { $pull: { 'ESPPracticeExams.0.savedQuestions': questionId } }
            : {
                  $addToSet: {
                      'ESPPracticeExams.0.savedQuestions': questionId,
                  },
              };

        const updatedCourse = await ESPPracticeModel.findOneAndUpdate(
            { user: userId },
            updateOperation,
            { new: true, upsert: true },
        );

        const updatedSavedQuestionsArray =
            updatedCourse?.ESPPracticeExams[0]?.savedQuestions;
        // const message = isQuestionSaved
        //     ? `Remove (-) Question ID: ${questionId} from savedQuestions, to userId: ${userId}`
        //     : `Add (+) Question ID: ${questionId} to savedQuestions, to userId: ${userId}`;
        const message = isQuestionSaved
            ? `Question Removed Successfully`
            : `Question Saved Successfully`;

        console.log(message);

        res.json({ updatedSavedQuestionsArray, message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export functions
module.exports = {
    GetSingleCourseById,
    addNewCoursesMiddleware,
    SaveQuestionById,
};
