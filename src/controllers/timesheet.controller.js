const mongoose = require('mongoose');
const Timesheet = require('../models/timesheet.model');

/**
 * Save a new timesheet entry
 * @route POST /api/timesheets
 * @access Private
 */
const saveTimesheet = async (req, res) => {
    try {
        const { billingType, description, project, task, timeEntry, date } = req.body;

        // Convert timeEntry (HH:mm) to decimal hours
        let hours = 0;
        if (timeEntry) {
            const [h, m] = timeEntry.split(':').map(Number);
            hours = h + (m / 60);
        }

        const timesheet = new Timesheet({
            user: req.user._id, // Assumes user is available in req.user from auth middleware
            project,
            task,
            billingType,
            description,
            hours,
            date: date || new Date(),
            status: 'Pending'
        });

        const savedTimesheet = await timesheet.save();

        res.status(201).json({
            success: true,
            message: 'Timesheet saved successfully',
            data: savedTimesheet
        });
    } catch (error) {
        console.error('Error saving timesheet:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

/**
 * Fetch all timesheet entries
 * @route GET /api/timesheets
 * @access Private
 */
const getTimesheets = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.query;
        const userRole = req.user.role;

        console.log('Fetching timesheets - userId param:', userId, 'user.role:', userRole, 'user._id:', req.user._id, 'status:', status);

        const filter = {};

        // Admins can view all timesheets; employees can only view their own
        if (userRole === 'admin' || req.user._id.toString() === userId) {
            // Admin users see all timesheets (userId parameter is ignored for admins)
            // Regular users can also view their own if they pass their own ID
            if (userRole === 'admin') {
                console.log('Admin access - showing all timesheets');
            } else {
                console.log('User viewing own timesheets');
                filter.user = userId;
            }
        } else if (userId) {
            // Non-admin user trying to view someone else's data
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID format'
                });
            }
            return res.status(403).json({
                success: false,
                message: 'You can only view your own timesheets'
            });
        }

        if (status) filter.status = status;

        const { populate } = req.query;

        let query = Timesheet.find(filter).sort({ createdAt: -1 });

        // By default keep existing behavior (populate). Clients can opt-out with ?populate=false
        if (populate === 'false') {
            // return raw ids
        } else {
            // Project model uses `name`, and User model uses `name` field.
            query = query.populate('project', 'name').populate('user', 'name email');
        }

        const timesheets = await query;

        // Group timesheets by status into lowercase keys: pending, approved, rejected
        const grouped = {
            pending: [],
            approved: [],
            rejected: []
        };

        timesheets.forEach((t) => {
            const s = (t.status || '').toLowerCase();
            if (s === 'pending') grouped.pending.push(t);
            else if (s === 'approved') grouped.approved.push(t);
            else if (s === 'rejected') grouped.rejected.push(t);
        });

        res.status(200).json({
            success: true,
            data: grouped
        });
    } catch (error) {
        console.error('Error fetching timesheets:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = {
    saveTimesheet,
    getTimesheets
};
