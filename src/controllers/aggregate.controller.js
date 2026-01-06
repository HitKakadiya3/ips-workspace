const Leave = require('../models/leave.model');
const mongoose = require('mongoose');
const CacheAccess = require('../services/cacheAccess');

exports.getLeaveStats = async (req, res, next) => {
    try {
        const data = await CacheAccess.remember('leaveStats', 300, async () => {
            // Pipeline 1: Count leaves by status
            const statusStats = await Leave.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalDuration: { $sum: '$duration' }
                    }
                }
            ]);

            // Pipeline 2: Top 5 employees with most leave duration
            const topLeavers = await Leave.aggregate([
                {
                    $group: {
                        _id: '$user',
                        totalLeaveDays: { $sum: '$duration' },
                        requestCount: { $sum: 1 }
                    }
                },
                { $sort: { totalLeaveDays: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'users', // Collection name (usually lowercase plural)
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        _id: 1,
                        totalLeaveDays: 1,
                        requestCount: 1,
                        name: '$userDetails.name',
                        email: '$userDetails.email'
                    }
                }
            ]);

            return {
                leavesByStatus: statusStats,
                topLeavers: topLeavers
            };
        });

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        next(error);
    }
};
