const Announcement = require('../models/announcement.model');

exports.getAnnouncements = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalItems = await Announcement.countDocuments({ isActive: true });
        const totalPages = Math.ceil(totalItems / limit);

        const announcements = await Announcement.find({ isActive: true })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: announcements,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.addAnnouncement = async (req, res, next) => {
    try {
        const { title, description, priority, date, type } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Title and description are required' });
        }

        const announcementData = {
            title,
            description,
            priority: priority || 'Medium',
            type: type || 'General',
            date: date || undefined,
            createdBy: req.user._id,
            authorName: req.user.name
        };

        if (req.file) {
            // Store the path relative to the uploads folder for clean URLs
            announcementData.attachment = req.file.path.replace(/\\/g, '/').replace(/^src\//, '').replace(/^\//, '');
        }

        const announcement = await Announcement.create(announcementData);

        res.status(201).json({ success: true, data: announcement });
    } catch (error) {
        next(error);
    }
};

exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findByIdAndUpdate(id, { isActive: false }, { new: true });

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
    } catch (error) {
        next(error);
    }
};
