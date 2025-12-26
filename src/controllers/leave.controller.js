const Leave = require('../models/leave.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.getLeaveCountsByType = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const counts = await Leave.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$leaveType', count: { $sum: 1 } } }
        ]);

        const leaveTypes = (Leave.schema.path('leaveType') && Leave.schema.path('leaveType').enumValues) || ['Personal', 'Unpaid', 'Ad-hoc', 'Sick', 'Casual', 'Other'];
        const result = {};
        leaveTypes.forEach(t => { result[t] = 0; });
        counts.forEach(c => { result[c._id] = c.count; });

        res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error('Get Leave Counts Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = exports;

exports.addLeave = async (req, res) => {
    try {
        const { userId } = req.params;
        const { leaveType, startDate, endDate, reason, status, year } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!leaveType || !startDate || !endDate) {
            return res.status(400).json({ message: 'leaveType, startDate and endDate are required' });
        }

        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format for startDate or endDate' });
        }

        const leaveYear = year || sDate.getFullYear();

        const leaveDoc = await Leave.create({
            user: user._id,
            leaveType,
            startDate: sDate,
            endDate: eDate,
            reason: reason || '',
            status: status || 'Pending',
            year: leaveYear
        });

        res.status(201).json({ success: true, data: leaveDoc });

    } catch (error) {
        console.error('Add Leave Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
