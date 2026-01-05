require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

// Connect to Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ DB Connection Failed', error);
        process.exit(1);
    }
};

const runTransactionDemo = async () => {
    await connectDB();

    const session = await mongoose.startSession();

    try {
        console.log('\n--- Scenario 1: Successful Transaction ---');
        session.startTransaction();

        const user1 = {
            name: 'Transaction User 1',
            email: 'trans_user_1@example.com',
            password: 'password123',
            role: 'employee'
        };

        const createdUser1 = await User.create([user1], { session });
        console.log('User 1 Created in session:', createdUser1[0].email);

        await session.commitTransaction();
        console.log('✅ Transaction Committed Successfully');

        // Verify
        const foundUser1 = await User.findOne({ email: user1.email });
        console.log('Verify User 1 exists in DB:', !!foundUser1);


        console.log('\n--- Scenario 2: Failed Transaction (Rollback) ---');
        session.startTransaction();

        const user2 = {
            name: 'Transaction User 2',
            email: 'trans_user_2@example.com',
            password: 'password123',
            role: 'employee'
        };

        const createdUser2 = await User.create([user2], { session });
        console.log('User 2 Created in session:', createdUser2[0].email);

        console.log('Simulating an error...');
        throw new Error('Intentional Error to trigger rollback');

        await session.commitTransaction(); // Should not reach here

    } catch (error) {
        console.log('❌ Caught Error:', error.message);
        console.log('Rolling back transaction...');
        await session.abortTransaction();
        console.log('✅ Transaction Aborted Successfully');
    } finally {
        session.endSession();
    }

    // Verify Rollback
    const foundUser2 = await User.findOne({ email: 'trans_user_2@example.com' });
    console.log('Verify User 2 exists in DB (Should be false):', !!foundUser2);

    // Clean up User 1
    await User.deleteOne({ email: 'trans_user_1@example.com' });
    console.log('Cleanup: User 1 deleted');

    console.log('\n--- Demo Completed ---');
    process.exit(0);
};

runTransactionDemo();
