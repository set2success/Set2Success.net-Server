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

const LMSSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    topics: [TopicSchema],
});

const LMSModelTextBook = mongoose.model('LMS', LMSSchema);

module.exports = LMSModelTextBook;
