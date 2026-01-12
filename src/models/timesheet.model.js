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
        task: {
            type: String,
            required: true,
            trim: true
        },
        billingType: {
            type: String,
            enum: ['Billable', 'Non Billable'],
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
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
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Timesheet', timesheetSchema);
