require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const WFH = require('../models/wfh.model');
const connectDB = require('../config/database');

const seedWFH = async () => {
    try {
        await connectDB();

        const users = await User.find();
        if (users.length === 0) {
            console.log('⚠️ No users found. Please seed users first.');
            process.exit(1);
        }

        const wfhRequests = [];
        const statuses = ['Pending', 'Approved', 'Rejected'];
        const reasons = ['Not feeling well', 'AC Repair', 'Urgent personal work', 'Car breakdown', 'Family emergency', 'Doctor appointment'];

        // Generate 20 dummy WFH requests
        for (let i = 0; i < 20; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

            // Random date in the next 30 days or past 30 days
            const daysOffset = Math.floor(Math.random() * 60) - 30;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + daysOffset);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(startDate); // mostly 1 day leave
            if (Math.random() > 0.8) {
                // 20% chance of 2-3 days
                endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 2) + 1);
            }
            endDate.setHours(0, 0, 0, 0);

            wfhRequests.push({
                user: randomUser._id,
                startDate,
                endDate,
                reason: randomReason,
                status: randomStatus,
                isHalfDay: Math.random() > 0.8 // 20% chance of half day
            });
        }

        await WFH.insertMany(wfhRequests);

        console.log('✅ WFH data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding WFH:', error);
        process.exit(1);
    }
};

seedWFH();
