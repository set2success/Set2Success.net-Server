const express = require('express');
const questionBankJSON = require('./QuestionBankJsonData.json');
const QuestionBankModal = require('../models/QuestionBankModal');

// Get single course that contains the logged-in userId and specified courseName
const GetSingleCourseById = async (req, res) => {
    const { userId } = req.params;
    const { courseName } = req.query;

    try {
        if (!courseName) {
            return res.status(400).json({ error: 'CourseName is required' });
        }

        // Find the course that matches the specified user ID and course name
        const course = await QuestionBankModal.findOne(
            { user: userId },
            { QuestionBankDataSet: { $elemMatch: { courseName } } },
        );

        // let courses = [];
        // let course = await QuestionBankModal.findOne({ user: userId });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course?.QuestionBankDataSet);
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
        const coursesJSON = questionBankJSON.QuestionBankDataSet;

        // Retrieve Existing Courses:
        let existingCourses = await QuestionBankModal.findOne({
            user: userId,
        });

        // Create New Course Object if None Exists:
        if (!existingCourses) {
            existingCourses = new QuestionBankModal({
                user: userId,
                QuestionBankDataSet: [],
            });
        }

        // Filter New Courses:
        const newCourses = coursesJSON.filter((course) => {
            const doesCourseExist = existingCourses.QuestionBankDataSet.some(
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
        existingCourses.QuestionBankDataSet.push(...newCourses);

        // Save the updated courses
        const updatedCourses = await existingCourses.save();

        console.log('New Courses Added [ESP] ✅');
        req.updatedCourses = updatedCourses; // Pass the result to the next middleware
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Store Result: SubmitResult
const SubmitStatistics = async (req, res) => {
    const {
        userId,
        courseName,
        totalQuestions,
        correctQuestions,
        wrongQuestions,
        completed,
        percentage,
        topicName,
        subSectionTitle,
    } = req.body;

    try {
        const course = await QuestionBankModal.findOne({ user: userId });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const QBCourse = course.QuestionBankDataSet.find(
            (exam) => exam.courseName === courseName,
        );

        let topicIndex = -1;
        //TODO: set QB essay names here.
        if (courseName === 'ESP_Essay_P2' || courseName === 'ESP_Essay_P2') {
            topicIndex = QBCourse.statistics.findIndex(
                (stat) => stat.subSectionTitle === subSectionTitle,
            );
        } else {
            topicIndex = QBCourse.statistics.findIndex(
                (stat) => stat.topicName === topicName,
            );
        }

        if (topicIndex !== -1) {
            // If topic exists, update the statistics
            QBCourse.statistics[topicIndex] = {
                totalQuestions,
                correctQuestions,
                wrongQuestions,
                completed,
                percentage,
                topicName,
                subSectionTitle,
                date: new Date(),
            };
        } else {
            // If topic does not exist, push new statistics
            QBCourse.statistics.push({
                totalQuestions,
                correctQuestions,
                wrongQuestions,
                completed,
                percentage,
                topicName,
                subSectionTitle,
                date: new Date(),
            });
        }

        const updatedCourse = await course.save();

        return res.status(200).json({
            message: 'Result Submitted Successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Result: SubmitStatistics
const GetStatistics = async (req, res) => {
    const { userId, courseName } = req.query;

    try {
        const course = await QuestionBankModal.findOne({ user: userId });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const QBCourse = course.QuestionBankDataSet.find(
            (exam) => exam.courseName === courseName,
        );

        console.log(`Statistics fetched for courseName: ${courseName} ✅`);

        return res.status(200).json({
            data: QBCourse,
            message: 'Result Fetched Successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export functions
module.exports = {
    GetSingleCourseById,
    addNewCoursesMiddleware,
    SubmitStatistics,
    GetStatistics,
};
