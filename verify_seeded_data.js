require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./src/models/project.model');
const User = require('./src/models/user.model'); // Register User model for population

const verifyProjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const projects = await Project.find({}).populate('assignedUsers', 'name email');
        console.log(`Found ${projects.length} projects:`);
        projects.forEach(p => {
            console.log(`- ${p.name} (Client: ${p.clientName}, PM: ${p.pmName}, Status: ${p.status}, Type: ${p.projectType})`);
        });
        process.exit();
    } catch (error) {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    }
};

verifyProjects();
