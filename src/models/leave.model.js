const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        leaveType: {
            type: String,
            enum: ['Personal', 'Unpaid', 'Ad-hoc', 'Sick', 'Casual', 'Other'],
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        reason: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        year: {
            type: Number,
            required: true
        },
        isHalfDay: {
            type: Boolean,
            default: false
        },
        partOfDay: {
            type: String,
            default: null
        },
        duration: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
