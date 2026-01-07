const Project = require('../models/project.model');
const mongoose = require('mongoose');

/**
 * @desc    Get projects based on user role (Admin: all, Employee: assigned)
 * @route   GET /api/projects
 * @access  Private
 */
exports.getProjects = async (req, res, next) => {
    try {
        let query = {};

        const projects = await Project.find(query)
            .populate('assignedUsers', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all projects assigned to a specific user
 * @route   GET /api/projects/user/:userId
 * @access  Private
 */
exports.getProjectsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid User ID'
            });
        }

        const projects = await Project.find({
            assignedUsers: new mongoose.Types.ObjectId(userId)
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });

    } catch (error) {
        next(error);
    }
};
