require('dotenv').config();
const mongoose = require('mongoose');

const Project = require('./src/models/project.model');
const Timesheet = require('./src/models/timesheet.model');
const Leave = require('./src/models/leave.model');
const Notice = require('./src/models/notice.model');
const Appreciation = require('./src/models/appreciation.model');
const Attendance = require('./src/models/attendance.model');
const Reminder = require('./src/models/reminder.model');
const Announcement = require('./src/models/announcement.model');
const InternalLink = require('./src/models/internalLink.model');
const Reward = require('./src/models/reward.model');
const Certification = require('./src/models/certification.model');

const userId = '694a43267cd54f179267f7b7';

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for Seeding');

        // Projects
        await Project.create([
            {
                name: 'Website Redesign',
                startDate: new Date('2024-01-01'),
                deadline: new Date('2024-03-01'),
                status: 'Active',
                assignedUsers: [userId],
                isBillable: true
            },
            {
                name: 'Mobile App Support',
                startDate: new Date('2023-06-01'),
                deadline: new Date('2023-12-31'),
                status: 'Completed',
                assignedUsers: [userId],
                isBillable: true
            },
            {
                name: 'Legacy Migration',
                startDate: new Date('2023-09-01'),
                deadline: new Date('2023-11-30'),
                status: 'Overdue',
                assignedUsers: [userId],
                isBillable: false
            }
        ]);
        console.log('✅ Projects created');

        // Fetch a project ID for timesheets
        const project = await Project.findOne({ assignedUsers: userId });

        // Timesheets
        await Timesheet.create([
            {
                user: userId,
                project: project._id,
                date: new Date(),
                hours: 8,
                description: 'Frontend development',
                status: 'Submitted'
            },
            {
                user: userId,
                project: project._id,
                date: new Date(Date.now() - 86400000), // Yesterday
                hours: 8,
                description: 'Bug fixing',
                status: 'Approved'
            },
            {
                user: userId,
                project: project._id,
                date: new Date(Date.now() - 172800000), // Day before yesterday
                hours: 4,
                description: 'Meeting',
                status: 'Submitted'
            }
        ]);
        console.log('✅ Timesheets created');

        // Leaves
        await Leave.create([
            {
                user: userId,
                leaveType: 'Personal',
                startDate: new Date('2024-02-10'),
                endDate: new Date('2024-02-12'),
                reason: 'Family function',
                status: 'Approved',
                year: 2024
            },
            {
                user: userId,
                leaveType: 'Sick',
                startDate: new Date('2024-03-01'),
                endDate: new Date('2024-03-02'),
                reason: 'Fever',
                status: 'Pending',
                year: 2024
            }
        ]);
        console.log('✅ Leaves created');

        // Notices
        await Notice.create({
            user: userId,
            title: 'Late Arrival Warning',
            description: 'Please ensure you arrive by 9:30 AM.',
            severity: 'Low'
        });
        console.log('✅ Notice created');

        // Appreciations
        await Appreciation.create({
            user: userId,
            title: 'Employee of the Month',
            description: 'Outstanding performance in Project X.',
            date: new Date()
        });
        console.log('✅ Appreciation created');

        // Attendance
        await Attendance.create([
            {
                user: userId,
                date: new Date(),
                checkInTime: new Date(new Date().setHours(9, 30, 0)),
                checkOutTime: null, // Still working
                isShortDay: false
            },
            {
                user: userId,
                date: new Date(Date.now() - 86400000),
                checkInTime: new Date(new Date().setHours(9, 30, 0)),
                checkOutTime: new Date(new Date().setHours(18, 30, 0)),
                totalHours: 9,
                isShortDay: false
            },
            {
                user: userId,
                date: new Date(Date.now() - 172800000),
                checkInTime: new Date(new Date().setHours(10, 0, 0)),
                checkOutTime: new Date(new Date().setHours(14, 0, 0)),
                totalHours: 4,
                isShortDay: true
            }
        ]);
        console.log('✅ Attendance created');

        // Reminders
        await Reminder.create([
            {
                user: userId,
                title: 'Submit Timesheet',
                description: 'Don\'t forget to submit this week\'s timesheet.',
                dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
            },
            {
                user: userId,
                title: 'Team Lunch',
                description: 'Friday team lunch at 1 PM.',
                dueDate: new Date(new Date().setDate(new Date().getDate() + 3))
            }
        ]);
        console.log('✅ Reminders created');

        // Announcements
        await Announcement.create([
            {
                title: 'Office Holiday',
                content: 'Office will be closed on Friday.',
                type: 'Holiday',
                priority: 'High'
            },
            {
                user: userId,
                title: 'Performance Review',
                content: 'Your review is scheduled for next week.',
                type: 'General',
                priority: 'Medium'
            }
        ]);
        console.log('✅ Announcements created');

        // Internal Links
        await InternalLink.create([
            {
                title: 'HR Portal',
                url: 'https://hr.example.com',
                icon: 'users',
                order: 1
            },
            {
                user: userId,
                title: 'My Project Board',
                url: 'https://jira.example.com/browse/PROJ',
                icon: 'trello',
                order: 2
            }
        ]);
        console.log('✅ InternalLinks created');

        // Rewards
        await Reward.create({
            user: userId,
            title: 'Bug Bash Winner',
            description: 'Most bugs found in Q1.',
            points: 500
        });
        console.log('✅ Reward created');

        // Certifications
        await Certification.create({
            user: userId,
            name: 'AWS Certified Developer',
            issuingOrganization: 'Amazon Web Services',
            issueDate: new Date('2023-08-15'),
            expiryDate: new Date('2026-08-15'),
            credentialUrl: 'https://aws.amazon.com/verify'
        });
        console.log('✅ Certification created');

        console.log('🎉 Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
