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

        // If user is not an admin, only show projects they are assigned to
        if (req.user.role.toLowerCase() !== 'admin') {
            query.assignedUsers = req.user._id;
        }

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

        // Authorization: Admin can see all, Employees can only see their own
        if (req.user.role.toLowerCase() !== 'admin' && req.user._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access these projects'
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

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:projectId
 * @access  Private
 */
exports.getProjectById = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Project ID'
            });
        }

        const project = await Project.findById(projectId)
            .populate('assignedUsers', 'name email');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // If user is not an admin, check if they are assigned to this project
        if (req.user.role.toLowerCase() !== 'admin' && !project.assignedUsers.some(u => u._id.toString() === req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this project'
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin only)
 */
exports.createProject = async (req, res, next) => {
    try {
        // Authorization check: Only Admin can create projects
        if (req.user.role.toLowerCase() !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to create projects'
            });
        }

        const {
            name,
            startDate,
            deadline,
            status,
            projectType,
            clientName,
            pmName,
            assignedUsers,
            assignees, // Added support for 'assignees'
            isBillable
        } = req.body;

        // Validation
        if (!name || !startDate) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and startDate'
            });
        }

        const project = await Project.create({
            name,
            startDate,
            deadline,
            status: status || 'Active',
            projectType,
            clientName,
            pmName,
            assignedUsers: assignedUsers || assignees || [], // Map assignees to assignedUsers
            isBillable: isBillable !== undefined ? isBillable : true
        });

        res.status(201).json({
            success: true,
            data: project
        });

    } catch (error) {
        next(error);
    }
};
