const mongoose = require('mongoose');

const SubTopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    pdfLink: { type: String },
    isCompleted: { type: Boolean, default: false },
});

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtopics: [SubTopicSchema],
});

const courseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courses: [
        {
            courseName: { type: String, required: true },
            topics: [TopicSchema],
        },
    ],
});

const CourseTextBookModel = mongoose.model('course', courseSchema);

module.exports = CourseTextBookModel;
