const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        hours: {
            type: Number,
            required: true,
            min: 0
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['Submitted', 'Approved', 'Rejected'],
            default: 'Submitted'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Timesheet', timesheetSchema);
