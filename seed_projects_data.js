require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./src/models/project.model');

const projectsData = [
    {
        name: 'FutureStack Labs',
        pmName: 'Jignesh',
        clientName: 'IPS Internal',
        status: 'In Progress',
        projectType: 'Dedicated',
        assignedUsers: ['694a43267cd54f179267f7b7']
    },
    {
        name: 'Laravel Team Sessions',
        pmName: 'Jignesh',
        clientName: 'IPS Internal',
        status: 'In Progress',
        projectType: 'Dedicated',
        assignedUsers: ['694a43267cd54f179267f7b7']
    },
    {
        name: 'CG Meeting',
        pmName: 'Rajendra',
        clientName: 'IPS Internal',
        status: 'In Progress',
        projectType: 'Dedicated',
        assignedUsers: ['694a43267cd54f179267f7b7']
    },
    {
        name: 'Presales',
        pmName: 'Jignesh',
        clientName: 'IPS Internal',
        status: 'In Progress',
        projectType: 'Dedicated',
        assignedUsers: ['694a8ab27cd54f179267f7ca']
    },
    {
        name: 'EnProwess Projects Development',
        pmName: 'Jinkal',
        clientName: 'Chirayu J',
        status: 'Completed',
        projectType: 'Dedicated',
        assignedUsers: ['694a8ab27cd54f179267f7ca']
    },
    {
        name: 'Laravel Packages & Library',
        pmName: 'Jignesh',
        clientName: 'IPS Internal',
        status: 'Completed',
        projectType: 'T & M',
        assignedUsers: ['694a8ab27cd54f179267f7ca']
    },
    {
        name: 'ORS',
        pmName: 'Keyul',
        clientName: 'Lakshmi V',
        status: 'On Hold',
        projectType: 'Dedicated',
        assignedUsers: ['694a8ab27cd54f179267f7ca']
    }
];

const seedProjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Delete all projects
        await Project.deleteMany({});
        console.log('🗑️ Existing projects deleted');

        // Add mandatory fields (startDate, deadline)
        const projectsWithDates = projectsData.map(p => ({
            ...p,
            startDate: new Date(),
            deadline: new Date(new Date().setMonth(new Date().getMonth() + 6))
        }));

        await Project.insertMany(projectsWithDates);
        console.log('✅ Projects seeded successfully');

        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedProjects();
