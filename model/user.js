const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, 
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        usertype: {
            type: String,
            required: true,
        }
    },
    {   timestamps: true,
        collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;