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

CourseTextBookRouter.post(
    '/addNewCourses',
    checkUserLoggedIn,
    async (req, res) => {
        try {
            let userId;
            if (req.body.userId) {
                userId = req.body.userId;
            } else {
                userId = req.userId;
            }

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
