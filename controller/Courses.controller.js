const express = require('express');
const User = require('../models/User');

// [LMS_P1_TextBook, LMS_P1_Video, LMS_P2_TextBook, LMS_P2_Video, MindMap_P1_Maps, MindMap_P2_Maps, examSupportPackage_P1, examSupportPackage_P2]
const allCourseJson = require('./AllCoursesJSON.json');
const CourseTextBookModel = require('../models/CourseModalTextBook');

// [ESP_MCQ_P1, ESP_Essay_P1, ESP_MCQ_P2, ESP_Essay_P2]
const ESPPracticeJSON = require('./ESP_Practice_Data.json');
const ESPPracticeModel = require('../models/ESPPracticeModal');

// [QB_MCQ_P1, QB_Essay_P1, QB_MCQ_P2, QB_Essay_P2]
const QBDataJSON = require('./QuestionBankJsonData.json');
const QuestionBankModal = require('../models/QuestionBankModal');

const addCoursesToUser = async (
    userId,
    courseName,
    JSONData,
    myModal,
    arrayName,
) => {
    try {
        // Retrieve existing courses for the current user
        let existingCourses = await myModal.findOne({
            user: userId,
        });

        // If no existing document, create a new one
        if (!existingCourses) {
            existingCourses = new myModal({
                user: userId,
                [arrayName]: [],
            });
        }

        const newCourse = JSONData.find((course) => {
            return course.courseName === courseName;
        });

        // if the courseName is not found in the JSON file, return a message
        if (!newCourse) {
            console.log('Course not found in the JSON file');
            return 'Course not found in the JSON file';
        }

        // If the course already exists, return a message
        if (
            existingCourses[arrayName].some(
                (existingCourse) =>
                    existingCourse.courseName === newCourse.courseName,
            )
        ) {
            console.log('Course already exists for the current user');
            return 'Course already exists for the current user';
        }

        // Add new course to the existing user's courses array
        existingCourses[arrayName].push(newCourse);
        console.log(`🚀 User : ${userId}, Courses Added : ${courseName}  🎉`);

        // Save the updated document
        const updatedCourses = await existingCourses.save();

        // Return a success message or updated courses
        return updatedCourses;
    } catch (error) {
        console.error(error.message);
        return error.message;
    }
};

const fetchCourseAndAdd = async (userId, courseArray) => {
    for (const course of courseArray) {
        if (course === 'lmsPurchaseP1') {
            await addCoursesToUser(
                userId,
                'LMS_P1_TextBook',
                allCourseJson.courses,
                CourseTextBookModel,
                'courses',
            );
            await addCoursesToUser(
                userId,
                'LMS_P1_Video',
                allCourseJson.courses,
                CourseTextBookModel,
                'courses',
            );
        } else if (course === 'lmsPurchaseP2') {
            await addCoursesToUser(
                userId,
                'LMS_P2_TextBook',
                allCourseJson.courses,
                CourseTextBookModel,
                'courses',
            );
            await addCoursesToUser(
                userId,
                'LMS_P2_Video',
                allCourseJson.courses,
                CourseTextBookModel,
                'courses',
            );
        } else if (course === 'mindMapPurchaseP1') {
            await addCoursesToUser(
                userId,
                'MindMap_P1_Maps',
                allCourseJson.courses,
                CourseTextBookModel,
                'courses',
            );
        } else if (course === 'mindMapPurchaseP2') {
            await addCoursesToUser(
                userId,
                'MindMap_P2_Maps',
                allCourseJson.courses,
                CourseTextBookModel,
                'courses',
            );
        } else if (course === 'espPurchaseP1') {
            await addCoursesToUser(
                userId,
                'examSupportPackage_P1',
                allCourseJson.courses,
                CourseTextBookModel,
                'courses',
            );
            await addCoursesToUser(
                userId,
                'ESP_MCQ_P1',
                ESPPracticeJSON.ESPPracticeExams,
                ESPPracticeModel,
                'ESPPracticeExams',
            );
            await addCoursesToUser(
                userId,
                'ESP_Essay_P1',
                ESPPracticeJSON.ESPPracticeExams,
                ESPPracticeModel,
                'ESPPracticeExams',
            );
        } else if (course === 'espPurchaseP2') {
            await addCoursesToUser(
                userId,
                'examSupportPackage_P2',
                allCourseJson.courses,
                CourseTextBookModel,
                'courses',
            );
            await addCoursesToUser(
                userId,
                'ESP_MCQ_P2',
                ESPPracticeJSON.ESPPracticeExams,
                ESPPracticeModel,
                'ESPPracticeExams',
            );
            await addCoursesToUser(
                userId,
                'ESP_Essay_P2',
                ESPPracticeJSON.ESPPracticeExams,
                ESPPracticeModel,
                'ESPPracticeExams',
            );
        } else if (course === 'qbPurchaseP1') {
            await addCoursesToUser(
                userId,
                'QB_MCQ_P1',
                QBDataJSON.QuestionBankDataSet,
                QuestionBankModal,
                'QuestionBankDataSet',
            );
            await addCoursesToUser(
                userId,
                'QB_Essay_P1',
                QBDataJSON.QuestionBankDataSet,
                QuestionBankModal,
                'QuestionBankDataSet',
            );
        } else if (course === 'qbPurchaseP2') {
            await addCoursesToUser(
                userId,
                'QB_MCQ_P2',
                QBDataJSON.QuestionBankDataSet,
                QuestionBankModal,
                'QuestionBankDataSet',
            );
            await addCoursesToUser(
                userId,
                'QB_Essay_P2',
                QBDataJSON.QuestionBankDataSet,
                QuestionBankModal,
                'QuestionBankDataSet',
            );
        }
    }
};

// fetchCourseAndAdd('65ad51868d455e3de84efcc4', [
//     'lmsPurchaseP1',
//     'lmsPurchaseP2',
// ]);
// fetchCourseAndAdd('65ad51868d455e3de84efcc4', [
//     'lmsPurchaseP1',
//     'lmsPurchaseP2',
//     'mindMapPurchaseP1',
//     'mindMapPurchaseP2',
//     'espPurchaseP1',
//     'espPurchaseP2',
//     'qbPurchaseP1',
//     'qbPurchaseP2',
// ]);
module.exports = fetchCourseAndAdd;
