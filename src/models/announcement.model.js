const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['Event', 'News', 'Holiday', 'General'],
            default: 'General'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
