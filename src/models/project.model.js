const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        deadline: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Overdue', 'On Hold', 'In Progress'],
            default: 'Active'
        },
        projectType: {
            type: String,
            trim: true
        },
        clientName: {
            type: String,
            trim: true
        },
        pmName: {
            type: String,
            trim: true
        },
        assignedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        isBillable: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
