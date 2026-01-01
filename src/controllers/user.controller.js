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
