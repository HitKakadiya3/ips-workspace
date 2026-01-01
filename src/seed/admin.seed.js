require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const connectDB = require('../config/database');

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin', 10);

        await User.create({
            name: 'admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin user seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
