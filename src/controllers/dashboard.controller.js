const mongoose = require('mongoose');
const Project = require('../models/project.model');
const Timesheet = require('../models/timesheet.model');
const Leave = require('../models/leave.model');
const Notice = require('../models/notice.model');
const Appreciation = require('../models/appreciation.model');
const Attendance = require('../models/attendance.model');
const Reminder = require('../models/reminder.model');
const Announcement = require('../models/announcement.model');
const InternalLink = require('../models/internalLink.model');
const Reward = require('../models/reward.model');
const Certification = require('../models/certification.model');

exports.getDashboardData = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);


        // Parallelize all queries for performance
        const [
            projects,
            timesheets,
            leaves,
            notices,
            appreciations,
            attendance,
            reminders,
            announcements,
            internalLinks,
            rewards,
            certifications
        ] = await Promise.all([
            Project.find({ assignedUsers: userObjectId }).lean(),
            Timesheet.find({ user: userObjectId }).sort({ date: -1 }).limit(50).lean(),
            Leave.find({ user: userObjectId }).sort({ startDate: -1 }).lean(),
            Notice.find({ user: userObjectId }).sort({ date: -1 }).lean(),
            Appreciation.find({ user: userObjectId }).sort({ date: -1 }).lean(),
            Attendance.find({ user: userObjectId }).sort({ date: -1 }).limit(30).lean(),
            Reminder.find({ user: userObjectId }).sort({ dueDate: 1 }).lean(),
            Announcement.find({
                $or: [{ type: 'General' }, { user: userObjectId }, { type: 'Holiday' }]
            }).sort({ date: -1 }).limit(10).lean(),
            InternalLink.find({
                $or: [{ user: { $exists: false } }, { user: userObjectId }]
            }).sort({ order: 1 }).lean(),
            Reward.find({ user: userObjectId }).sort({ date: -1 }).lean(),
            Certification.find({ user: userObjectId }).sort({ issueDate: -1 }).lean()
        ]);
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        const totalProjectsAssigned = projects.length;
        const overdueProjectsCount = projects.filter(p => p.status === 'Overdue').length;

        const projectMap = projects.reduce((acc, p) => {
            acc[p._id.toString()] = p;
            return acc;
        }, {});

        let totalBillableHours = 0;
        let totalBenchHours = 0;
        let timesheetNotFilledCount = 0;

        const yearlyTimesheetStats = await Timesheet.aggregate([
            { $match: { user: userObjectId, date: { $gte: startOfYear } } },
            { $lookup: { from: 'projects', localField: 'project', foreignField: '_id', as: 'projectInfo' } },
            { $unwind: '$projectInfo' },
            {
                $group: {
                    _id: null,
                    billable: {
                        $sum: { $cond: [{ $eq: ['$projectInfo.isBillable', true] }, '$hours', 0] }
                    },
                    bench: {
                        $sum: { $cond: [{ $eq: ['$projectInfo.isBillable', false] }, '$hours', 0] }
                    }
                }
            }
        ]);

        if (yearlyTimesheetStats.length > 0) {
            totalBillableHours = yearlyTimesheetStats[0].billable;
            totalBenchHours = yearlyTimesheetStats[0].bench;
        }

        const personalLeaves = leaves.filter(l => l.leaveType === 'Personal' && l.status === 'Approved').length;
        const totalPersonalLeaves = 16;

        const unpaidLeaves = leaves.filter(l => l.leaveType === 'Unpaid').length;
        const takenLeaves = leaves.length;
        const adHocLeaves = leaves.filter(l => l.leaveType === 'Ad-hoc').length;

        const shortDays = attendance.filter(a => a.isShortDay && a.date >= startOfYear).length;

        res.status(200).json({
            success: true,
            data: {
                widgets: {
                    projects: {
                        totalAssigned: totalProjectsAssigned,
                        overdueCount: overdueProjectsCount,
                        billableHours: totalBillableHours,
                        benchHours: totalBenchHours
                    },
                    leaves: {
                        personal: `${personalLeaves}/${totalPersonalLeaves}`,
                        unpaid: `${unpaidLeaves}/60`, // Hardcoded total as per UI example or config
                        taken: takenLeaves,
                        adHoc: adHocLeaves
                    },
                    noticesAndAppreciations: {
                        totalNotices: notices.length,
                        totalAppreciations: appreciations.length
                    },
                    generic: {
                        shortDays: shortDays,
                        timesheetNotFilled: 0 // Placeholder: requires complex logic to check missing dates against calendar
                    }
                },
                lists: {
                    overdueProjects: projects.filter(p => p.status === 'Overdue'),
                    reminders: reminders,
                    announcements: announcements,
                    internalLinks: internalLinks,
                    rewards: rewards,
                    certifications: certifications,
                    leavesNext5Days: [] // Placeholder: Requires filtering leaves by date range
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
