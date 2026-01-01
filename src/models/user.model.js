const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            trim: true
        },
        dateOfJoining: {
            type: Date
        },
        dateOfBirth: {
            type: Date
        },
        primaryTechnology1: {
            type: String,
            trim: true
        },
        primaryTechnology2: {
            type: String,
            trim: true
        },
        intermediateTechnology: {
            type: String,
            trim: true
        },
        database: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            enum: ['admin', 'employee'],
            default: 'employee'
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
