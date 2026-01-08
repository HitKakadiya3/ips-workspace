const Document = require('../models/document.model');
const CacheAccess = require('../services/cacheAccess');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadDocument = async (req, res, next) => {
    try {
        const { title, description, accessType, shareWith } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'At least one file is required' });
        }

        const documentFiles = files.map(file => ({
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            path: file.path,
            size: file.size
        }));

        const newDocument = new Document({
            title,
            description,
            accessType,
            shareWith: shareWith ? (Array.isArray(shareWith) ? shareWith : [shareWith]) : [],
            files: documentFiles,
            uploadedBy: req.user.id
        });

        await newDocument.save();

        // Invalidate cache
        await CacheAccess.del(`documents:${req.user.id}`);

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: newDocument
        });
    } catch (error) {
        next(error);
    }
};

exports.getDocuments = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Fetch documents:
        // 1. Where accessType is Public
        // 2. Where accessType is Private and uploadedBy is current user
        // Note: shareWith functionality can be added later if needed, 
        // but user specifically mentioned private only for owner.

        const documents = await CacheAccess.remember(`documents:${userId}`, 300, async () => {
            return await Document.find({
                $or: [
                    { accessType: 'Public' },
                    { accessType: 'Private', uploadedBy: userId }
                ]
            }).populate('uploadedBy', 'name email')
                .sort({ createdAt: -1 });
        });

        res.status(200).json(documents);
    } catch (error) {
        next(error);
    }
};

exports.deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check ownership
        if (document.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this document' });
        }

        // Delete files from filesystem
        if (document.files && document.files.length > 0) {
            document.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        await Document.findByIdAndDelete(id);

        // Invalidate cache
        await CacheAccess.del(`documents:${userId}`);

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.downloadDocument = async (req, res, next) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/documents', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(filePath, filename, (err) => {
            if (err) {
                if (res.headersSent) {
                    // Headers already sent, cannot send another response
                    return;
                }
                next(err);
            }
        });
    } catch (error) {
        next(error);
    }
};
