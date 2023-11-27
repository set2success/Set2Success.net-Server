const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    sNo: {type: Number, required: true},
    title: { type: String, required: true },
    quesType: { type: String, required: true },
    essayAnswer: { type: String, required: true },
    answer: { type: String, required: true },
    options: [{ type: String }],
    correctOption: { type: Number, required: true },
    correctOptionExplanation: { type: String, required: true },
    note: { type: String, required: true },
    isCompleted: { type: Boolean, default: false, required: true },
    isFlagged: { type: Boolean, default: false, required: true },
});


const SubTopicSchema = new mongoose.Schema({
    subSectionTitle: { type: String, required: true },
    questions: [questionSchema]
});


const TopicSchema = new mongoose.Schema({
    sectionTitle: { type: String, required: true },
    subSectionTopics: [SubTopicSchema],
});

const ESPPracticeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ESPPracticeExams: [
            {
                courseName: { type: String, required: true },
                topics: [TopicSchema],
            },
        ],
    },
    { timestamps: true },
);

const ESPPracticeModel = mongoose.model('espPractice', ESPPracticeSchema);
module.exports = ESPPracticeModel;