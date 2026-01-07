const projectController = require('./src/controllers/project.controller');
const Project = require('./src/models/project.model');
const mongoose = require('mongoose');

// Mocking mongoose Model
Project.find = function (query) {
    console.log('Project.find called with query:', JSON.stringify(query));
    return {
        populate: function (field, select) {
            console.log(`populate called for field: ${field}, select: ${select}`);
            return this;
        },
        sort: function (order) {
            console.log('sort called with order:', JSON.stringify(order));
            return Promise.resolve([
                { _id: 'proj1', name: 'Project 1', assignedUsers: ['user1'] },
                { _id: 'proj2', name: 'Project 2', assignedUsers: ['user1', 'user2'] }
            ]);
        }
    };
};

async function testGetProjects() {
    console.log('--- Testing Admin Access ---');
    const adminReq = {
        user: { role: 'admin', _id: 'adminId' }
    };
    const res = {
        status: function (code) {
            this.statusCode = code;
            return this;
        },
        json: function (data) {
            console.log('Response status:', this.statusCode);
            console.log('Response data:', JSON.stringify(data, null, 2));
        }
    };
    const next = (err) => console.error('Next called with error:', err);

    await projectController.getProjects(adminReq, res, next);

    console.log('\n--- Testing Employee Access ---');
    const employeeReq = {
        user: { role: 'employee', _id: 'user1Id' }
    };
    await projectController.getProjects(employeeReq, res, next);
}

testGetProjects().catch(err => console.error(err));
