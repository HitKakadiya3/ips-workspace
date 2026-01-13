const mongoose = require('mongoose');
const Timesheet = require('../models/timesheet.model');

/**
 * Save a new timesheet entry
 * @route POST /api/timesheets
 * @access Private
 */
const saveTimesheet = async (req, res) => {
    try {
        const { billingType, description, project, task, hours, date } = req.body;

        // Convert hours (HH:mm) to decimal hours
        let decimalHours = 0;
        if (hours) {
            const [h, m] = hours.split(':').map(Number);
            decimalHours = h + (m / 60);
        }

        const timesheet = new Timesheet({
            user: req.user._id, // Assumes user is available in req.user from auth middleware
            project,
            task,
            billingType,
            description,
            hours: decimalHours,
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

        const { billingType, project, task, startDate, endDate } = req.query;

        if (billingType) {
            filter.billingType = billingType;
        }

        if (project) {
            filter.project = project;
        }

        if (task) {
            filter.task = { $regex: task, $options: 'i' };
        }

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                const start = new Date(startDate);
                if (!isNaN(start.getTime())) {
                    start.setHours(0, 0, 0, 0);
                    filter.date.$gte = start;
                }
            }
            if (endDate) {
                const end = new Date(endDate);
                if (!isNaN(end.getTime())) {
                    end.setHours(23, 59, 59, 999);
                    filter.date.$lte = end;
                }
            }
        }

        const { populate, page, limit } = req.query;

        let query = Timesheet.find(filter).sort({ createdAt: -1 });

        // By default keep existing behavior (populate). Clients can opt-out with ?populate=false
        if (populate === 'false') {
            // return raw ids
        } else {
            // Project model uses `name`, and User model uses `name` field.
            query = query.populate('project', 'name').populate('user', 'name email');
        }

        // Pagination Logic
        if (page && limit) {
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const skip = (pageNum - 1) * limitNum;

            const total = await Timesheet.countDocuments(filter);
            const timesheets = await query.skip(skip).limit(limitNum);

            return res.status(200).json({
                success: true,
                data: timesheets,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    pages: Math.ceil(total / limitNum)
                }
            });
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

/**
 * Update timesheet status
 * @route PATCH /api/timesheets/:id/status
 * @access Private/Admin (should be admin ideally, or authorized user)
 */
const updateTimesheetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Allowed values: Approved, Rejected, Pending'
            });
        }

        const timesheet = await Timesheet.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!timesheet) {
            return res.status(404).json({
                success: false,
                message: 'Timesheet not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Timesheet status updated to ${status}`,
            data: timesheet
        });
    } catch (error) {
        console.error('Error updating timesheet status:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

/**
 * Fetch timesheets for a specific user for a specific day
 * @route GET /api/timesheets/user/:userId/daily
 * @access Private
 */
const getDailyTimesheets = async (req, res) => {
    try {
        const { userId } = req.params;
        const { date } = req.query;

        // Base date is either provided or today
        const targetDate = date ? new Date(date) : new Date();

        // Validate date
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        // Start of day
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        // End of day
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const timesheets = await Timesheet.find({
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        })
            .populate('project', 'name')
            .populate('user', 'name email')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: timesheets.length,
            data: timesheets
        });
    } catch (error) {
        console.error('Error fetching daily timesheets:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

/**
 * Delete a timesheet entry
 * @route DELETE /api/timesheets/:id
 * @access Private
 */
const deleteTimesheet = async (req, res) => {
    try {
        const { id } = req.params;

        const timesheet = await Timesheet.findByIdAndDelete(id);

        if (!timesheet) {
            return res.status(404).json({
                success: false,
                message: 'Timesheet not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Timesheet deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting timesheet:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = {
    saveTimesheet,
    getTimesheets,
    updateTimesheetStatus,
    getDailyTimesheets,
    deleteTimesheet
};
