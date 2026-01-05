const Leave = require('../models/leave.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.getLeaveCountsByType = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const { year } = req.query;

        const match = { user: new mongoose.Types.ObjectId(userId) };
        if (year !== undefined) {
            const y = Number(year);
            if (!Number.isInteger(y) || y < 1900 || y > 3000) {
                return res.status(400).json({ message: 'Invalid year parameter' });
            }
            // match only by year extracted from startDate or endDate
            match.$expr = {
                $or: [
                    { $eq: [{ $year: '$startDate' }, y] },
                    { $eq: [{ $year: '$endDate' }, y] }
                ]
            };
        }

        const counts = await Leave.aggregate([
            { $match: match },
            { $group: { _id: '$leaveType', count: { $sum: 1 } } }
        ]);

        const leaveTypes = (Leave.schema.path('leaveType') && Leave.schema.path('leaveType').enumValues) || ['Personal', 'Unpaid', 'Ad-hoc', 'Sick', 'Casual', 'Other'];
        const result = {};
        leaveTypes.forEach(t => { result[t] = 0; });
        counts.forEach(c => { result[c._id] = c.count; });

        res.status(200).json({ success: true, data: result });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;

exports.addLeave = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { leaveType, startDate, endDate, reason, status, year, isHalfDay, partOfDay, duration } = req.body;

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
            year: leaveYear,
            isHalfDay: isHalfDay || false,
            partOfDay: partOfDay || null,
            duration: duration || (isHalfDay ? 0.5 : 1)
        });

        res.status(201).json({ success: true, data: leaveDoc });

    } catch (error) {
        next(error);
    }
};

exports.getLeavesByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { year } = req.query;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const pipeline = [
            { $match: { user: new mongoose.Types.ObjectId(userId) } }
        ];

        if (year !== undefined) {
            const y = Number(year);
            if (!Number.isInteger(y) || y < 1900 || y > 3000) {
                return res.status(400).json({ message: 'Invalid year parameter' });
            }
            pipeline.push({
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$year', y] },
                            { $eq: [{ $year: '$startDate' }, y] },
                            { $eq: [{ $year: '$endDate' }, y] }
                        ]
                    }
                }
            });
        }

        pipeline.push({ $sort: { startDate: -1 } });

        const leaves = await Leave.aggregate(pipeline);

        res.status(200).json({ success: true, data: leaves });

    } catch (error) {
        next(error);
    }
};

exports.getLeaveById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Leave ID' });
        }

        const leave = await Leave.findById(id).lean();
        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        res.status(200).json({ success: true, data: leave });
    } catch (error) {
        next(error);
    }
};

exports.getAllLeaves = async (req, res, next) => {
    try {
        const { status } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'startDate';
        const order = req.query.order === 'asc' ? 1 : -1;

        const filter = {};
        if (status && status !== 'all') {
            // Capitalize first letter to match enum (Pending, Approved, Rejected)
            const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            filter.status = formattedStatus;
        }

        const totalItems = await Leave.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        const leaves = await Leave.find(filter)
            .populate('user', 'name email mobileNumber')
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: leaves,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateLeaveStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Leave ID' });
        }

        if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Approved, Rejected, or Pending' });
        }

        const leave = await Leave.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        res.status(200).json({ success: true, data: leave });
    } catch (error) {
        next(error);
    }
};
