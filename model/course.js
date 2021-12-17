const mongoose = require('mongoose');

// const assignmentSchema = require("/assignment");

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
        // assignments: [assignmentSchema]
    },
    {   timestamps: true,
        collection: 'courses' }
)

const modelCourse = mongoose.model('CourseSchema', CourseSchema);
module.exports = modelCourse;
