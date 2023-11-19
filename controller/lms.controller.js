const express = require('express');
const CourseTextBookRouter = express();
const CourseTextBookModel = require('../models/CourseModalTextBook');
const cookie = require('cookie'); // Import the 'cookie' package to store user
const jwt = require('jsonwebtoken');
const SESSION_PASSWORD = process.env.SESSION_PASSWORD;
const allCourseJson = require('./AllCoursesJSON.json');

// GET all courses
CourseTextBookRouter.get('/courses', async (req, res) => {
    try {
        const courses = await CourseTextBookModel.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a specific course by ID
CourseTextBookRouter.get('/courses/:id', getCourse, (req, res) => {
    res.json(res.course);
});

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

// Create New Courses
// CourseTextBookRouter.post('/courses', checkUserLoggedIn, async (req, res) => {
//     // const course = new CourseTextBookModel({
//     //     courseName: req.body.courseName,
//     //     topics: req.body.topics,
//     // });

//     try {
//         const userId = req.userId;
//         // Create a new course
//         const newCourse = new CourseTextBookModel({
//             user: userId,
//             courses: [
//                 {
//                     courseName: 'LMS_P1_TextBook',
//                     topics: [
//                         {
//                             title: 'Section A - External Financial Reporting Decisions',
//                             subtopics: [
//                                 {
//                                     title: 'A1 - Financial Statements',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1xfkOiWYW3evgfUiOjDwrF85sPqRT8Ujz/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'A2 - Recognition, Measurement, Valuation and Disclosure',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1uPWXha9QW8GHmgG6XH348JPpqTLw2cSU/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section B - Planning, Budgeting, and Forecasting',
//                             subtopics: [
//                                 {
//                                     title: 'B1 - Strategic Planning',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1iOmnF6V2-IL4ztfNgvxF3L8n2H9vTa-m/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B2 - Budgeting Concepts',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/11AOlPHlcn1jDLCMa5VIKTDBskmO5ROUq/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B3 - Forecasting Techniques',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1eAblxYL_Xa2It1HQ5PvYH4gOdrM5g-lE/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B4 - Budget Methodologies',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1HCLK_4Gy2nuWBgaXsj08JKfb0xIoe4OU/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B5 - Annual Profit Plan & Supporting Schedules & Top Level Planning & Analysis',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/10v3pGoAwKZdnNu33G_2QV9U_S1dMtAkD/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B6 - Annual Profit Plan & Supporting Schedules & Top Level Planning & Analysis',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/10v3pGoAwKZdnNu33G_2QV9U_S1dMtAkD/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section C - Performance Management',
//                             subtopics: [
//                                 {
//                                     title: 'C1 - Cost and Variance Measures',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/186vlfwgrE3feVEovT1lIEHUUgLSkirAE/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'C2 - Responsibility Centers and Reporting Segments',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1nPRux4NKjCwhzyJ1z8Elv-yxjT9RmhMn/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'C3 - Performance Measures',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1L1dq2L4S94c5jprHQmcqnW7FIF3iGBgV/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section D - Cost Management',
//                             subtopics: [
//                                 {
//                                     title: 'D1 - Measurement Concepts',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1sJwHcE6VPDjZ7vsUiT7X1JYVGzmDT8Ok/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'D2 - Costing Systems',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1arunI7SzoQSQLdvspnNUx4Bt2U07IOub/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'D3 - Overhead Costs',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1HPCdDV2rdw98uT71gNabZUNYhdaOhPvg/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'D4 - Supply Chain Management',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1CwYks6IQZFqCOhFm1di1_bwG3FO29dVC/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'D5 - Business Process Improvement',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1QNTyKQ8EU_sXfqF7fEfoEPfQt8UCFZIA/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section E - Internal Controls',
//                             subtopics: [
//                                 {
//                                     title: 'E1 - Governance, Risk, and Compliance',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1FYsErPs9YVocKC9VZs03krj_Rru3nJSX/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'E2 - Systems Controls and Security Measures',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1oXmdyraCJNaq78OBAWLmWVNpUbO9fZQS/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section F - Technology and Analytics',
//                             subtopics: [
//                                 {
//                                     title: 'F1 - Information Systems',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1Zv6lcEM5ivOY4mjqzhqtncx59NAtcmFm/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'F2 - Data Governance',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1B97FjtERmJiZ5ml8bpYvcUoaJrOonMqd/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'F3 - Technology Enabled Finance Transformation',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1nf0NYcVAgtX5EZaZzL3Bb1kqzKWKJyFU/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'F4 - Data Analytics',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1CdCmc78WPHnBJeJo53kPTfN6EgEYBG3T/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                     ],
//                 },
//                 {
//                     courseName: 'LMS_P2_TextBook',
//                     topics: [
//                         {
//                             title: 'Section A - External Financial Reporting Decisions',
//                             subtopics: [
//                                 {
//                                     title: 'A1 - Financial Statements',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1xfkOiWYW3evgfUiOjDwrF85sPqRT8Ujz/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'A2 - Recognition, Measurement, Valuation and Disclosure',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1uPWXha9QW8GHmgG6XH348JPpqTLw2cSU/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section B - Planning, Budgeting, and Forecasting',
//                             subtopics: [
//                                 {
//                                     title: 'B1 - Strategic Planning',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1iOmnF6V2-IL4ztfNgvxF3L8n2H9vTa-m/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B2 - Budgeting Concepts',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/11AOlPHlcn1jDLCMa5VIKTDBskmO5ROUq/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B3 - Forecasting Techniques',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1eAblxYL_Xa2It1HQ5PvYH4gOdrM5g-lE/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B4 - Budget Methodologies',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1HCLK_4Gy2nuWBgaXsj08JKfb0xIoe4OU/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B5 - Annual Profit Plan & Supporting Schedules & Top Level Planning & Analysis',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/10v3pGoAwKZdnNu33G_2QV9U_S1dMtAkD/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'B6 - Annual Profit Plan & Supporting Schedules & Top Level Planning & Analysis',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/10v3pGoAwKZdnNu33G_2QV9U_S1dMtAkD/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section C - Performance Management',
//                             subtopics: [
//                                 {
//                                     title: 'C1 - Cost and Variance Measures',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/186vlfwgrE3feVEovT1lIEHUUgLSkirAE/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'C2 - Responsibility Centers and Reporting Segments',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1nPRux4NKjCwhzyJ1z8Elv-yxjT9RmhMn/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'C3 - Performance Measures',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1L1dq2L4S94c5jprHQmcqnW7FIF3iGBgV/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section D - Cost Management',
//                             subtopics: [
//                                 {
//                                     title: 'D1 - Measurement Concepts',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1sJwHcE6VPDjZ7vsUiT7X1JYVGzmDT8Ok/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'D2 - Costing Systems',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1arunI7SzoQSQLdvspnNUx4Bt2U07IOub/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'D3 - Overhead Costs',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1HPCdDV2rdw98uT71gNabZUNYhdaOhPvg/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'D4 - Supply Chain Management',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1CwYks6IQZFqCOhFm1di1_bwG3FO29dVC/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'D5 - Business Process Improvement',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1QNTyKQ8EU_sXfqF7fEfoEPfQt8UCFZIA/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section E - Internal Controls',
//                             subtopics: [
//                                 {
//                                     title: 'E1 - Governance, Risk, and Compliance',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1FYsErPs9YVocKC9VZs03krj_Rru3nJSX/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'E2 - Systems Controls and Security Measures',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1oXmdyraCJNaq78OBAWLmWVNpUbO9fZQS/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                         {
//                             title: 'Section F - Technology and Analytics',
//                             subtopics: [
//                                 {
//                                     title: 'F1 - Information Systems',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1Zv6lcEM5ivOY4mjqzhqtncx59NAtcmFm/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'F2 - Data Governance',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1B97FjtERmJiZ5ml8bpYvcUoaJrOonMqd/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'F3 - Technology Enabled Finance Transformation',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1nf0NYcVAgtX5EZaZzL3Bb1kqzKWKJyFU/preview',
//                                     isCompleted: false,
//                                 },
//                                 {
//                                     title: 'F4 - Data Analytics',
//                                     pdfLink:
//                                         'https://drive.google.com/file/d/1CdCmc78WPHnBJeJo53kPTfN6EgEYBG3T/preview',
//                                     isCompleted: false,
//                                 },
//                             ],
//                         },
//                     ],
//                 },
//             ],
//         });

//         // Check if a course with the same name already exists for the current user
//         const existingCourse = await CourseTextBookModel.findOne({
//             user: userId,
//             // courseName: courseName1,
//         });

//         if (existingCourse) {
//             return res.status(401).json({
//                 message:
//                     'Course already exists with the same name for the current user',
//             });
//         }

//         // Save the new course
//         const savedCourse = await newCourse1.save();

//         res.status(201).json(savedCourse);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

CourseTextBookRouter.post(
    '/addNewCourses',
    checkUserLoggedIn,
    async (req, res) => {
        try {
            const userId = req.userId;
            const courses = allCourseJson.courses;

            // Retrieve existing courses for the current user
            let existingCourses = await CourseTextBookModel.findOne({
                user: userId,
            });

            // If no existing document, create a new one
            if (!existingCourses) {
                existingCourses = new CourseTextBookModel({
                    user: userId,
                    courses: [],
                });
            }

            // Filter out courses that already exist for the current user
            const newCourses = courses.filter((newCourse) => {
                return !existingCourses.courses.some(
                    (existingCourse) =>
                        existingCourse.courseName === newCourse.courseName,
                );
            });

            // If there are no new courses to add, return a message
            if (newCourses.length === 0) {
                return res.status(401).json({
                    message:
                        'All provided courses already exist for the current user',
                });
            }

            // Add new courses to the existing user's courses array
            existingCourses.courses.push(...newCourses);

            // Save the updated document
            const updatedCourses = await existingCourses.save();

            res.status(201).json(updatedCourses);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
);

// Middleware to get a specific course by ID
async function getCourse(req, res, next) {
    let course;
    try {
        course = await CourseTextBookModel.findById(req.params.id);
        if (course == null) {
            return res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.course = course;
    next();
}

// Route to get a specific subtopic by ID
CourseTextBookRouter.get('/courses/subtopic/:subtopicId', async (req, res) => {
    const { subtopicId } = req.params;

    try {
        const course = await CourseTextBookModel.findOne(
            { 'topics.subtopics._id': subtopicId },
            {
                'topics.$': 1, // Projection to get only the matched subtopic
            },
        );

        if (!course) {
            return res.status(404).json({ error: 'Subtopic not found' });
        }

        const subtopic = course.topics[0].subtopics.find(
            (sub) => sub._id.toString() === subtopicId,
        );

        if (!subtopic) {
            return res.status(404).json({ error: 'Subtopic not found' });
        }

        res.json(subtopic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update a specific subtopic by ID
CourseTextBookRouter.put('/courses/subtopic/:subtopicId', async (req, res) => {
    const { subtopicId } = req.params;
    // const { pdfLink, isCompleted } = req.body;
    const { isCompleted, courseName, userId } = req.body;

    try {
        if (!courseName) {
            return res.status(400).json({ error: 'CourseName is required' });
        }

        // Find the course that matches the specified user ID and course name
        const course = await CourseTextBookModel.findOne(
            { user: userId },
            { courses: { $elemMatch: { courseName } } },
        );

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const foundCourse = course.courses[0];

        //now find the subtopic of this foundCourse whose id is subtopicId
        // const subtopic = foundCourse.topics[0].subtopics.find(
        //     (sub) => sub._id.toString() === subtopicId,
        // );
        //foundCourse contain multiple topics & each topic have multiple subtopics, now find the subtopic of this foundCourse whose id is subtopicId
        const subtopic = foundCourse.topics
            .find((t) =>
                t.subtopics.some((sub) => sub._id.toString() === subtopicId),
            )
            .subtopics.find((sub) => sub._id.toString() === subtopicId);

        if (!subtopic) {
            return res.status(404).json({ error: 'Subtopic not found' });
        }
        // Update the subtopic with new data
        if (isCompleted !== undefined) {
            subtopic.isCompleted = isCompleted;
        }
        // Save changes in database
        await course.save();
        res.json({ message: 'Subtopic updated successfully' });

        // const course = await CourseTextBookModel.findOne({
        //     'topics.subtopics._id': subtopicId,
        // });

        // if (!course) {
        //     return res.status(404).json({ error: 'Subtopic not found' });
        // }

        // Find the correct topic and subtopic using $elemMatch
        // const topic = course.topics.find((t) =>
        //     t.subtopics.some((sub) => sub._id.toString() === subtopicId),
        // );

        // if (!topic) {
        //     return res.status(404).json({ error: 'Subtopic not found' });
        // }

        // const subtopicIndex = topic.subtopics.findIndex(
        //     (sub) => sub._id.toString() === subtopicId,
        // );

        // Update the subtopic properties
        // if (pdfLink !== undefined) {
        //     topic.subtopics[subtopicIndex].pdfLink = pdfLink;
        // }

        // if (isCompleted !== undefined) {
        //     topic.subtopics[subtopicIndex].isCompleted = isCompleted;
        // }

        // Save the updated document
        // await course.save();

        // res.json({ message: 'Subtopic updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT (update) a specific course by ID
CourseTextBookRouter.put('/courses/:id', getCourse, async (req, res) => {
    if (req.body.courseName != null) {
        res.course.courseName = req.body.courseName;
    }
    if (req.body.topics != null) {
        res.course.topics = req.body.topics;
    }

    try {
        const updatedCourse = await res.course.save();
        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a specific course by ID
CourseTextBookRouter.delete('/courses/:id', getCourse, async (req, res) => {
    try {
        await res.course.remove();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a course by userId
CourseTextBookRouter.get('/courses/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const course = await CourseTextBookModel.findOne({ user: userId });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get single course that contains the logged-in userId and specified courseName
CourseTextBookRouter.get('/all-courses/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { courseName } = req.query;

    try {
        if (!courseName) {
            return res.status(400).json({ error: 'CourseName is required' });
        }

        // Find the course that matches the specified user ID and course name
        const course = await CourseTextBookModel.findOne(
            { user: userId },
            { courses: { $elemMatch: { courseName } } },
        );

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course.courses[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = CourseTextBookRouter;
