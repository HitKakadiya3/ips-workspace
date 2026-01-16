require('dotenv').config();
const mongoose = require('mongoose');
const Announcement = require('../models/announcement.model');
const connectDB = require('../config/database');

const seedAnnouncements = async () => {
    try {
        await connectDB();

        const admin = await mongoose.model('User').findOne({ role: 'admin' });
        const creatorId = admin ? admin._id : new mongoose.Types.ObjectId();
        const creatorName = admin ? admin.name : 'System Admin';

        const dummyAnnouncements = [
            {
                title: 'Welcome to the New Office',
                description: 'We are excited to announce that we are moving to a new office space next month!',
                priority: 'High',
                date: new Date(),
                createdBy: creatorId,
                authorName: creatorName
            },
            {
                title: 'Annual Performance Reviews',
                description: 'Performance reviews for the current year will start from January 20th.',
                priority: 'Medium',
                date: new Date(),
                createdBy: creatorId,
                authorName: creatorName
            },
            {
                title: 'Upcoming Holiday',
                description: 'Please note that the office will be closed on January 26th for Republic Day.',
                priority: 'Low',
                date: new Date(),
                createdBy: creatorId,
                authorName: creatorName
            },
            {
                title: 'New Health Insurance Policy',
                description: 'We have updated our health insurance policy. Please check the HR portal for details.',
                priority: 'High',
                date: new Date(),
                createdBy: creatorId,
                authorName: creatorName
            },
            {
                title: 'Tech Talk: Introduction to Node.js',
                description: 'Join us for a tech talk on Node.js best practices this Friday at 4 PM.',
                priority: 'Medium',
                date: new Date(),
                createdBy: creatorId,
                authorName: creatorName
            }
        ];

        // Clear existing announcements (optional, but good for testing)
        // await Announcement.deleteMany({});

        await Announcement.insertMany(dummyAnnouncements);

        console.log('✅ Announcement data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding Announcements:', error);
        process.exit(1);
    }
};

seedAnnouncements();
