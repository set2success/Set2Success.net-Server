const express = require('express');
const ESPPracticeModel = require('../models/ESPPracticeModal');
const CourseTextBookModel = require('../models/CourseModalTextBook');

// Get Result Read: SubmitStatistics
const GetStatisticsRead = async (req, res) => {
    const { userId } = req.query;

    try {
        const LMSCourse = await CourseTextBookModel.findOne({ user: userId });

        if (!LMSCourse) {
            return res.status(404).json({ error: 'LMSCourse not found' });
        }

        const getLMSData = (courseName) => {
            const lmsTextBookCourse = LMSCourse.courses.find(
                (exam) => exam.courseName === courseName,
            );

            if (!lmsTextBookCourse) {
                return null;
            }

            return lmsTextBookCourse.topics.reduce(
                (acc, topic) => {
                    acc.totalTopicsLength += topic?.subtopics.length ?? 0;
                    acc.completedTopicsLength +=
                        topic?.subtopics.reduce(
                            (subAcc, subtopic) =>
                                subAcc + (subtopic?.isCompleted ? 1 : 0),
                            0,
                        ) ?? 0;
                    return acc;
                },
                {
                    totalTopicsLength: 0,
                    completedTopicsLength: 0,
                },
            );
        };

        const lmsDataP1 = getLMSData('LMS_P1_TextBook');
        const lmsDataP2 = getLMSData('LMS_P2_TextBook');
        const lmsDataVideoP1 = getLMSData('LMS_P1_Video');
        const lmsDataVideoP2 = getLMSData('LMS_P2_Video');
        const mindMapP1 = getLMSData('MindMap_P1_Maps');
        const mindMapP2 = getLMSData('MindMap_P2_Maps');
        const espLecturesP1 = getLMSData('examSupportPackage_P1');
        const espLecturesP2 = getLMSData('examSupportPackage_P2');

        if (!lmsDataP1 && !lmsDataP2) {
            return res.status(404).json({ error: 'LMSCourse not found' });
        }

        const combineResults = (lmsData) => {
            const percentage = (
                (lmsData.completedTopicsLength / lmsData.totalTopicsLength) *
                100
            ).toFixed(2);

            return {
                totalTopicsLength: lmsData.totalTopicsLength,
                completedTopicsLength: lmsData.completedTopicsLength,
                percentage,
            };
        };

        const resultP1 = lmsDataP1 ? combineResults(lmsDataP1) : null;
        const resultP2 = lmsDataP2 ? combineResults(lmsDataP2) : null;
        const resultVideoP1 = lmsDataVideoP1
            ? combineResults(lmsDataVideoP1)
            : null;
        const resultVideoP2 = lmsDataVideoP2
            ? combineResults(lmsDataVideoP2)
            : null;
        const resultMindMapP1 = mindMapP1 ? combineResults(mindMapP1) : null;
        const resultMindMapP2 = mindMapP2 ? combineResults(mindMapP2) : null;
        const resultESPLectureP1 = espLecturesP1
            ? combineResults(espLecturesP1)
            : null;
        const resultESPLectureP2 = espLecturesP2
            ? combineResults(espLecturesP2)
            : null;

        const ResponseArray = {
            LMS_P1_TextBook: resultP1,
            LMS_P2_TextBook: resultP2,
            LMS_P1_Video: resultVideoP1,
            LMS_P2_Video: resultVideoP2,
            MindMap_P1_Maps: resultMindMapP1,
            MindMap_P2_Maps: resultMindMapP2,
            ESP_Lecture_P1: resultESPLectureP1,
            ESP_Lecture_P2: resultESPLectureP2,
        };

        // console.log(`Statistics fetched for courseName: ${courseName} ✅`);
        return res.status(200).json({
            data: ResponseArray,
            message: 'Result Fetched Successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export functions
module.exports = {
    GetStatisticsRead,
};
