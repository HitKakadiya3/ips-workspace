const mongoose = require('mongoose');

const wfhSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        isHalfDay: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('WFH', wfhSchema);
