const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        checkInTime: {
            type: Date
        },
        checkOutTime: {
            type: Date
        },
        totalHours: {
            type: Number,
            default: 0
        },
        isShortDay: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
