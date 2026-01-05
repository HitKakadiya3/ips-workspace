const mongoose = require('mongoose');
const User = require('../models/user.model');

exports.testTransaction = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { scenario } = req.body; // 'success' or 'fail'

        // Setup random user data to avoid unique constraint collisions
        const randomId = Math.floor(Math.random() * 10000);
        const userData = {
            name: `Transaction API User ${randomId}`,
            email: `api_trans_${randomId}@example.com`,
            password: 'password123',
            role: 'employee'
        };

        const createdUsers = await User.create([userData], { session });
        const user = createdUsers[0];

        if (scenario === 'fail') {
            throw new Error('Intentional Failure to trigger Rollback');
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Transaction committed successfully',
            data: user
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Transaction Aborted:', error.message);

        res.status(400).json({
            success: false,
            message: 'Transaction aborted (Rollback successful)',
            error: error.message
        });
    }
};
