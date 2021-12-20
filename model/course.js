const mongoose = require('mongoose');

// const assignmentSchema = require("/assignment");
const assignmentSchema = new mongoose.Schema(
    {
        assignmentId: {
            type: String,
            required: true,
            unique: true
        },
        assignmentName: {
            type: String,
            required: true,
        },
        questions: {
            type: [String],
        },
        answers: {
            type: [String],
        }
    },
    {
        timestamps: true,
        collection: 'assignments'
    }
)

const CourseSchema = new mongoose.Schema(
    {
        CourseNum: {
            type: String,
            required: true,
        },
        CourseName: {
            type: String,
            required: true,
        },
        CourseID: {
            type: String,
            required: true,
        },
        CourseCredits: {
            type: Number,
            required: true
        },
        CourseDescription: {
            type: String,
            required: true,
        },
        CourseMaterials: {
            type: String,
            required: true,
        },
        Instructors: {
            type: [String],
            required: true
        },
        Students: [String],
        assignments: [assignmentSchema]
    },
    {   timestamps: true,
        collection: 'courses' }
)

const modelCourse = mongoose.model('CourseSchema', CourseSchema);
module.exports = modelCourse;
