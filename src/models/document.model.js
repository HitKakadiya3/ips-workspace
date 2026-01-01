const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        accessType: {
            type: String,
            enum: ['Private', 'Public'],
            required: true,
            default: 'Private'
        },
        shareWith: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        files: [
            {
                fileName: String,
                originalName: String,
                mimeType: String,
                path: String,
                size: Number
            }
        ],
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
