const User = require('../models/user.model');
const mongoose = require('mongoose');

exports.updateProfile = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        // Prevent email from being updated
        if (updates.email) {
            delete updates.email;
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });


    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const query = { role: { $not: { $regex: /^admin$/i } } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) {
            if (role.toLowerCase() === 'admin') {
                return res.status(200).json({ users: [], totalPages: 0, currentPage: Number(page), totalUsers: 0 });
            }
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.status(200).json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalUsers: count
        });
    } catch (error) {
        next(error);
    }
};

