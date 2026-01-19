require('dotenv').config();
const mongoose = require('mongoose');
const NoticeAppreciation = require('../models/noticeAppreciation.model');
const User = require('../models/user.model');
const Project = require('../models/project.model');
const connectDB = require('../config/database');

const seedNoticeAppreciations = async () => {
    try {
        await connectDB();

        // Get some users and a project for references
        const users = await User.find().limit(5);
        const projects = await Project.find().limit(2);

        if (users.length === 0) {
            console.error('❌ No users found to seed notice/appreciations. Please seed users first.');
            process.exit(1);
        }

        const employee1 = users[0];
        const employee2 = users[1] || users[0];
        const admin = await User.findOne({ role: 'admin' }) || users[0];
        const project = projects[0] || null;

        const demoData = [
            {
                user: employee1._id,
                type: 'Notice',
                subType: 'Leave',
                title: 'Leave Policy Violation',
                description: 'You have taken leaves without prior approval.',
                date: new Date('2025-12-16'),
                severity: 'Medium'
            },
            {
                user: employee1._id,
                type: 'Notice',
                subType: 'Timesheet',
                title: 'Pending Timesheet',
                description: 'Please fill your timesheet for the last week.',
                date: new Date('2025-11-18'),
                severity: 'Low'
            },
            {
                user: employee2._id,
                type: 'Notice',
                subType: 'Leave',
                title: 'Late Login',
                description: 'Consistently logging in late for the past 3 days.',
                date: new Date('2025-11-12'),
                severity: 'Low'
            },
            {
                user: employee2._id,
                type: 'Notice',
                subType: 'Leave',
                title: 'Unprofessional Conduct',
                description: 'Reported misbehavior during the team meeting.',
                date: new Date('2025-11-11'),
                severity: 'High'
            },
            {
                user: employee2._id,
                type: 'Notice',
                subType: 'Leave',
                title: 'Security Policy',
                description: 'Leaving workstation unlocked multiple times.',
                date: new Date('2025-11-06'),
                severity: 'Medium'
            },
            {
                user: employee1._id,
                type: 'Appreciation',
                subType: 'Project Delivery',
                title: 'Excellent Work',
                description: 'Great job on completing the CMS project ahead of schedule.',
                project: project ? project._id : null,
                kpiCategory: 'Quality',
                date: new Date('2025-12-20'),
                awardedBy: admin._id
            },
            {
                user: employee2._id,
                type: 'Appreciation',
                subType: 'Teamwork',
                title: 'Team Player',
                description: 'Helping new team members onboarding smoothly.',
                kpiCategory: 'Soft Skills',
                date: new Date('2025-12-25'),
                awardedBy: admin._id
            }
        ];

        // Clear existing data (optional)
        await NoticeAppreciation.deleteMany({ isActive: true });

        await NoticeAppreciation.insertMany(demoData);

        console.log('✅ Notice and Appreciation data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding Notice and Appreciation data:', error);
        process.exit(1);
    }
};

seedNoticeAppreciations();
