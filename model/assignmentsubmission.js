const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
    {
        submissionID: {
            type: String,
            required: true,
            unique: true
        },
        assignmentID: {
            type: String,
            required: true,
        },
        courseID: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        answers: {
            type: [String],
        },
        answerFeedback:{
            type: [String],
        },
        status: {
            type: String
        },
        grade: {
            type: Number
        },
        feedback: {
            type: String
        }
    },
    {
        timestamps: true,
        collection: 'submissions'
    }
)

const model = mongoose.model('submissionSchema', submissionSchema);
module.exports = model;