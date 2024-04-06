const express = require('express');
const User = require('../models/User');
const ESPPracticeModel = require('../models/ESPPracticeModal');
const QuestionBankModal = require('../models/QuestionBankModal');

// Update ESP Courses for existing all users
const UpdateEspCoursesAllUsers = async (req, res) => {
    try {
        const {
            adminUserID,
            courseName,
            sectionTitle,
            subSectionTitle,
            title,
            newTitle,
            newOptions,
            newAnswer,
            correctOptionExplanation,
            courseType,
            essaySectionTitle,
            subEssayTitle,
            essayQuesTitle,
            newEssayQuesTitle,
            newEssayPDFLink,
        } = req.body;

        if (!adminUserID || !courseName || !courseType) {
            return res
                .status(400)
                .json({ message: 'Missing required parameters' });
        }

        const adminUser = await User.findById(adminUserID);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = await User.find({}, '_id');
        const userIds = users.map((user) => user._id);
        const updatedUsers = [];

        for (const userId of userIds) {
            const espCourse = await ESPPracticeModel.findOne({ user: userId });
            if (!espCourse) {
                continue;
            }
            const courseIndex = espCourse.ESPPracticeExams.findIndex(
                (course) => course.courseName === courseName,
            );
            if (courseIndex === -1) {
                continue;
            }
            if (courseType === 'MCQ') {
                const sectionIndex = espCourse.ESPPracticeExams[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === sectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.ESPPracticeExams[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subSectionTitle === subSectionTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.ESPPracticeExams[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === title,
                        );
                        if (questionIndex !== -1) {
                            const question =
                                espCourse.ESPPracticeExams[courseIndex].topics[
                                    sectionIndex
                                ].subSectionTopics[subSectionIndex].questions[
                                    questionIndex
                                ];

                            question.title = newTitle;
                            question.options = newOptions;
                            question.answer = newAnswer;
                            question.correctOptionExplanation =
                                correctOptionExplanation;
                            updatedUsers.push(userId);
                        }
                    }
                }
            } else if (courseType === 'Essay') {
                const sectionIndex = espCourse.ESPPracticeExams[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === essaySectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.ESPPracticeExams[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subEssayTitle === subEssayTitle,
                    );
                    if (subSectionIndex !== -1) {
                        if (newEssayPDFLink) {
                            espCourse.ESPPracticeExams[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[subSectionIndex].pdfLink =
                                newEssayPDFLink;
                        }
                        const questionIndex = espCourse.ESPPracticeExams[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === essayQuesTitle,
                        );
                        if (questionIndex !== -1) {
                            espCourse.ESPPracticeExams[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[subSectionIndex].questions[
                                questionIndex
                            ].title = newEssayQuesTitle;
                            updatedUsers.push(userId);
                        }
                    }
                }
            }
            await espCourse.save();
        }

        res.status(200).json({
            message: 'Courses updated successfully for these users',
            totalUsers: userIds,
            updatedUsers,
        });
    } catch (error) {
        console.error('Error performing action:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update QB Courses for existing all users
const UpdateQbCoursesAllUsers = async (req, res) => {
    try {
        const {
            adminUserID,
            courseName,
            sectionTitle,
            subSectionTitle,
            title,
            newTitle,
            newOptions,
            newAnswer,
            correctOptionExplanation,
            courseType,
            essaySectionTitle,
            subEssayTitle,
            essayQuesTitle,
            newEssayQuesTitle,
            newEssayPDFLink,
        } = req.body;

        if (!adminUserID || !courseName || !courseType) {
            return res
                .status(400)
                .json({ message: 'Missing required parameters' });
        }

        const adminUser = await User.findById(adminUserID);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = await User.find({}, '_id');
        const userIds = users.map((user) => user._id);
        const updatedUsers = [];

        for (const userId of userIds) {
            const qbCourse = await QuestionBankModal.findOne({ user: userId });
            if (!qbCourse) {
                continue;
            }
            const courseIndex = qbCourse.QuestionBankDataSet.findIndex(
                (course) => course.courseName === courseName,
            );
            if (courseIndex === -1) {
                continue;
            }
            if (courseType === 'MCQ') {
                const sectionIndex = qbCourse.QuestionBankDataSet[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === sectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = qbCourse.QuestionBankDataSet[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subSectionTitle === subSectionTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = qbCourse.QuestionBankDataSet[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === title,
                        );
                        if (questionIndex !== -1) {
                            const question =
                                qbCourse.QuestionBankDataSet[courseIndex]
                                    .topics[sectionIndex].subSectionTopics[
                                    subSectionIndex
                                ].questions[questionIndex];
                            question.title = newTitle;
                            question.options = newOptions;
                            question.answer = newAnswer;
                            question.correctOptionExplanation =
                                correctOptionExplanation;
                            updatedUsers.push(userId);
                        }
                    }
                }
            } else if (courseType === 'Essay') {
                const sectionIndex = qbCourse.QuestionBankDataSet[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === essaySectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = qbCourse.QuestionBankDataSet[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subEssayTitle === subEssayTitle,
                    );
                    if (subSectionIndex !== -1) {
                        if (newEssayPDFLink) {
                            qbCourse.QuestionBankDataSet[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[subSectionIndex].pdfLink =
                                newEssayPDFLink;
                        }
                        const questionIndex = qbCourse.QuestionBankDataSet[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === essayQuesTitle,
                        );
                        if (questionIndex !== -1) {
                            qbCourse.QuestionBankDataSet[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[subSectionIndex].questions[
                                questionIndex
                            ].title = newEssayQuesTitle;
                            updatedUsers.push(userId);
                        }
                    }
                }
            }
            await qbCourse.save();
        }

        res.status(200).json({
            message: 'Courses updated successfully for these users',
            totalUsers: userIds,
            updatedUsers,
        });
    } catch (error) {
        console.error('Error performing action:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add new questions to ESP existing courses for existing all users
const AddEspQuestionsAllUsers = async (req, res) => {
    try {
        const {
            adminUserID,
            courseName,
            sectionTitle,
            subSectionTitle,
            newTitle,
            newOptions,
            newAnswer,
            correctOptionExplanation,
            courseType,
            essaySectionTitle,
            subEssayTitle,
            newEssayQuesTitle,
            quesType,
        } = req.body;

        if (courseType === 'MCQ') {
            if (
                !adminUserID ||
                !courseName ||
                !courseType ||
                !sectionTitle ||
                !subSectionTitle ||
                !newTitle ||
                !newOptions ||
                !newAnswer ||
                !correctOptionExplanation
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            }
        } else if (courseType === 'Essay') {
            if (
                !adminUserID ||
                !courseName ||
                !courseType ||
                !essaySectionTitle ||
                !subEssayTitle ||
                !newEssayQuesTitle ||
                !quesType
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            }
        }

        const adminUser = await User.findById(adminUserID);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = await User.find({}, '_id');
        const userIds = users.map((user) => user._id);
        const updatedUsers = [];

        for (const userId of userIds) {
            const espCourse = await ESPPracticeModel.findOne({ user: userId });
            if (!espCourse) {
                continue;
            }
            const courseIndex = espCourse.ESPPracticeExams.findIndex(
                (course) => course.courseName === courseName,
            );
            if (courseIndex === -1) {
                continue;
            }
            if (courseType === 'MCQ') {
                const sectionIndex = espCourse.ESPPracticeExams[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === sectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.ESPPracticeExams[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subSectionTitle === subSectionTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.ESPPracticeExams[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === newTitle,
                        );
                        if (questionIndex === -1) {
                            const lastQuestionSNo =
                                espCourse.ESPPracticeExams[courseIndex].topics[
                                    sectionIndex
                                ].subSectionTopics[subSectionIndex].questions
                                    .length;
                            espCourse.ESPPracticeExams[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[subSectionIndex].questions.push({
                                sNo: lastQuestionSNo + 1,
                                title: newTitle,
                                options: newOptions,
                                answer: newAnswer,
                                correctOptionExplanation,
                            });
                            updatedUsers.push(userId);
                        }
                    }
                }
            } else if (courseType === 'Essay') {
                const sectionIndex = espCourse.ESPPracticeExams[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === essaySectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.ESPPracticeExams[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subEssayTitle === subEssayTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.ESPPracticeExams[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === newEssayQuesTitle,
                        );
                        if (questionIndex === -1) {
                            const lastQuestionSNo =
                                espCourse.ESPPracticeExams[courseIndex].topics[
                                    sectionIndex
                                ].subSectionTopics[subSectionIndex].questions
                                    .length;
                            espCourse.ESPPracticeExams[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[subSectionIndex].questions.push({
                                sNo: lastQuestionSNo + 1,
                                title: newEssayQuesTitle,
                                quesType,
                                isFlagged: false,
                            });
                            updatedUsers.push(userId);
                        }
                    }
                }
            }
            await espCourse.save();
        }
        res.status(200).json({
            message: 'Courses updated successfully for these users',
            totalUsers: userIds,
            updatedUsers,
        });
    } catch (error) {
        console.error('Error performing action:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add new questions to QB existing courses for existing all users
const AddQbQuestionsAllUsers = async (req, res) => {
    try {
        const {
            adminUserID,
            courseName,
            sectionTitle,
            subSectionTitle,
            newTitle,
            newOptions,
            newAnswer,
            correctOptionExplanation,
            courseType,
            essaySectionTitle,
            subEssayTitle,
            newEssayQuesTitle,
            quesType,
        } = req.body;

        if (courseType === 'MCQ') {
            if (
                !adminUserID ||
                !courseName ||
                !courseType ||
                !sectionTitle ||
                !subSectionTitle ||
                !newTitle ||
                !newOptions ||
                !newAnswer ||
                !correctOptionExplanation
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            }
        } else if (courseType === 'Essay') {
            if (
                !adminUserID ||
                !courseName ||
                !courseType ||
                !essaySectionTitle ||
                !subEssayTitle ||
                !newEssayQuesTitle ||
                !quesType
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            }
        }

        const adminUser = await User.findById(adminUserID);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = await User.find({}, '_id');
        const userIds = users.map((user) => user._id);
        const updatedUsers = [];

        for (const userId of userIds) {
            const espCourse = await QuestionBankModal.findOne({ user: userId });
            if (!espCourse) {
                continue;
            }
            const courseIndex = espCourse.QuestionBankDataSet.findIndex(
                (course) => course.courseName === courseName,
            );
            if (courseIndex === -1) {
                continue;
            }
            if (courseType === 'MCQ') {
                const sectionIndex = espCourse.QuestionBankDataSet[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === sectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.QuestionBankDataSet[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subSectionTitle === subSectionTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.QuestionBankDataSet[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === newTitle,
                        );
                        if (questionIndex === -1) {
                            const lastQuestionSNo =
                                espCourse.QuestionBankDataSet[courseIndex]
                                    .topics[sectionIndex].subSectionTopics[
                                    subSectionIndex
                                ].questions.length;
                            espCourse.QuestionBankDataSet[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[subSectionIndex].questions.push({
                                sNo: lastQuestionSNo + 1,
                                title: newTitle,
                                options: newOptions,
                                answer: newAnswer,
                                correctOptionExplanation,
                            });
                            updatedUsers.push(userId);
                        }
                    }
                }
            } else if (courseType === 'Essay') {
                const sectionIndex = espCourse.QuestionBankDataSet[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === essaySectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.QuestionBankDataSet[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subEssayTitle === subEssayTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.QuestionBankDataSet[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === newEssayQuesTitle,
                        );
                        if (questionIndex === -1) {
                            const lastQuestionSNo =
                                espCourse.QuestionBankDataSet[courseIndex]
                                    .topics[sectionIndex].subSectionTopics[
                                    subSectionIndex
                                ].questions.length;
                            espCourse.QuestionBankDataSet[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[subSectionIndex].questions.push({
                                sNo: lastQuestionSNo + 1,
                                title: newEssayQuesTitle,
                                quesType,
                                isFlagged: false,
                            });
                            updatedUsers.push(userId);
                        }
                    }
                }
            }
            await espCourse.save();
        }
        res.status(200).json({
            message: 'Courses updated successfully for these users',
            totalUsers: userIds,
            updatedUsers,
        });
    } catch (error) {
        console.error('Error performing action:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete existing question from ESP courses for existing all users
const DeleteESPQuestionsAllUsers = async (req, res) => {
    try {
        const {
            adminUserID,
            courseName,
            sectionTitle,
            subSectionTitle,
            questionTitle,
            courseType,
            essaySectionTitle,
            subEssayTitle,
            essayQuesTitle,
        } = req.body;

        if (courseType === 'MCQ') {
            if (
                !adminUserID ||
                !courseName ||
                !courseType ||
                !sectionTitle ||
                !subSectionTitle ||
                !questionTitle
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            }
        } else if (courseType === 'Essay') {
            if (
                !adminUserID ||
                !courseName ||
                !courseType ||
                !essaySectionTitle ||
                !subEssayTitle ||
                !essayQuesTitle
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            }
        }

        const adminUser = await User.findById(adminUserID);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = await User.find({}, '_id');
        const userIds = users.map((user) => user._id);
        const updatedUsers = [];

        for (const userId of userIds) {
            const espCourse = await ESPPracticeModel.findOne({ user: userId });
            if (!espCourse) {
                continue;
            }
            const courseIndex = espCourse.ESPPracticeExams.findIndex(
                (course) => course.courseName === courseName,
            );
            if (courseIndex === -1) {
                continue;
            }
            if (courseType === 'MCQ') {
                const sectionIndex = espCourse.ESPPracticeExams[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === sectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.ESPPracticeExams[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subSectionTitle === subSectionTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.ESPPracticeExams[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === questionTitle,
                        );
                        if (questionIndex !== -1) {
                            espCourse.ESPPracticeExams[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[
                                subSectionIndex
                            ].questions.splice(questionIndex, 1);
                            updatedUsers.push(userId);
                        }
                    }
                }
            } else if (courseType === 'Essay') {
                const sectionIndex = espCourse.ESPPracticeExams[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === essaySectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.ESPPracticeExams[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subEssayTitle === subEssayTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.ESPPracticeExams[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === essayQuesTitle,
                        );
                        if (questionIndex !== -1) {
                            espCourse.ESPPracticeExams[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[
                                subSectionIndex
                            ].questions.splice(questionIndex, 1);
                            updatedUsers.push(userId);
                        }
                    }
                }
            }
            await espCourse.save();
        }
        res.status(200).json({
            message: 'Courses updated successfully for these users',
            totalUsers: userIds,
            updatedUsers,
        });
    } catch (error) {
        console.error('Error performing action:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete existing question from QB courses for existing all users
const DeleteQBQuestionsAllUsers = async (req, res) => {
    try {
        const {
            adminUserID,
            courseName,
            sectionTitle,
            subSectionTitle,
            questionTitle,
            courseType,
            essaySectionTitle,
            subEssayTitle,
            essayQuesTitle,
        } = req.body;

        if (courseType === 'MCQ') {
            if (
                !adminUserID ||
                !courseName ||
                !courseType ||
                !sectionTitle ||
                !subSectionTitle ||
                !questionTitle
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            }
        } else if (courseType === 'Essay') {
            if (
                !adminUserID ||
                !courseName ||
                !courseType ||
                !essaySectionTitle ||
                !subEssayTitle ||
                !essayQuesTitle
            ) {
                return res
                    .status(400)
                    .json({ message: 'Missing required parameters' });
            }
        }

        const adminUser = await User.findById(adminUserID);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const users = await User.find({}, '_id');
        const userIds = users.map((user) => user._id);
        const updatedUsers = [];

        for (const userId of userIds) {
            const espCourse = await QuestionBankModal.findOne({ user: userId });
            if (!espCourse) {
                continue;
            }
            const courseIndex = espCourse.QuestionBankDataSet.findIndex(
                (course) => course.courseName === courseName,
            );
            if (courseIndex === -1) {
                continue;
            }
            if (courseType === 'MCQ') {
                const sectionIndex = espCourse.QuestionBankDataSet[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === sectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.QuestionBankDataSet[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subSectionTitle === subSectionTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.QuestionBankDataSet[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === questionTitle,
                        );
                        if (questionIndex !== -1) {
                            espCourse.QuestionBankDataSet[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[
                                subSectionIndex
                            ].questions.splice(questionIndex, 1);
                            updatedUsers.push(userId);
                        }
                    }
                }
            } else if (courseType === 'Essay') {
                const sectionIndex = espCourse.QuestionBankDataSet[
                    courseIndex
                ].topics.findIndex(
                    (section) => section.sectionTitle === essaySectionTitle,
                );
                if (sectionIndex !== -1) {
                    const subSectionIndex = espCourse.QuestionBankDataSet[
                        courseIndex
                    ].topics[sectionIndex].subSectionTopics.findIndex(
                        (subSection) =>
                            subSection.subEssayTitle === subEssayTitle,
                    );
                    if (subSectionIndex !== -1) {
                        const questionIndex = espCourse.QuestionBankDataSet[
                            courseIndex
                        ].topics[sectionIndex].subSectionTopics[
                            subSectionIndex
                        ].questions.findIndex(
                            (question) => question.title === essayQuesTitle,
                        );
                        if (questionIndex !== -1) {
                            espCourse.QuestionBankDataSet[courseIndex].topics[
                                sectionIndex
                            ].subSectionTopics[
                                subSectionIndex
                            ].questions.splice(questionIndex, 1);
                            updatedUsers.push(userId);
                        }
                    }
                }
            }
            await espCourse.save();
        }
        res.status(200).json({
            message: 'Courses updated successfully for these users',
            totalUsers: userIds,
            updatedUsers,
        });
    } catch (error) {
        console.error('Error performing action:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export functions
module.exports = {
    UpdateEspCoursesAllUsers,
    UpdateQbCoursesAllUsers,
    AddEspQuestionsAllUsers,
    AddQbQuestionsAllUsers,
    DeleteESPQuestionsAllUsers,
    DeleteQBQuestionsAllUsers,
};
