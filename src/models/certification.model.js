const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        issuingOrganization: {
            type: String,
            required: true,
            trim: true
        },
        issueDate: {
            type: Date,
            required: true
        },
        expiryDate: {
            type: Date
        },
        credentialUrl: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);
