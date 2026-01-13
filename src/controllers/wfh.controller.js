const WFH = require('../models/wfh.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.applyWFH = async (req, res, next) => {
    try {
        const { userId, startDate, endDate, reason, isHalfDay } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!startDate || !reason) {
            return res.status(400).json({ message: 'startDate and reason are required' });
        }

        const sDate = new Date(startDate);
        // If endDate is not provided, assume it's a single day leave (endDate = startDate)
        const eDate = endDate ? new Date(endDate) : new Date(startDate);

        if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        if (sDate > eDate) {
            return res.status(400).json({ message: 'startDate cannot be after endDate' });
        }

        const wfhRequest = await WFH.create({
            user: userId,
            startDate: sDate,
            endDate: eDate,
            reason,
            isHalfDay: isHalfDay || false
        });

        res.status(201).json({ success: true, data: wfhRequest });

    } catch (error) {
        next(error);
    }
};

exports.getWFHRequests = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status } = req.query;

        const filter = {};
        if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
            filter.status = status;
        }

        const totalItems = await WFH.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        const requests = await WFH.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: requests,
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

exports.getWFHRequestsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const filter = { user: userId };

        const totalItems = await WFH.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        const requests = await WFH.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: requests,
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
