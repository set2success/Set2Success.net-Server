const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    sNo: { type: Number },
    title: { type: String },
    quesType: { type: String },
    essayAnswer: { type: String },
    answer: { type: String },
    options: [{ type: String }],
    correctOptionExplanation: { type: String },
    note: { type: String },
    isFlagged: { type: Boolean, default: false },
});

const SubTopicSchema = new mongoose.Schema({
    subSectionTitle: { type: String },
    subEssayTitle: { type: String },
    pdfLink: { type: String },
    questions: [questionSchema],
});

const TopicSchema = new mongoose.Schema({
    sectionTitle: { type: String },
    subSectionTopics: [SubTopicSchema],
});

const ESPPracticeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        ESPPracticeExams: [
            {
                courseName: { type: String },
                topics: [TopicSchema],
                savedQuestions: [],
            },
        ],
    },
    { timestamps: true },
);

const ESPPracticeModel = mongoose.model('espPractice', ESPPracticeSchema);
module.exports = ESPPracticeModel;
