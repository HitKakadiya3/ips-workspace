const NoticeAppreciation = require('../models/noticeAppreciation.model');

exports.getNoticeAppreciations = async (req, res, next) => {
    try {
        const { type, subType, date, page = 1, limit = 10 } = req.query;
        const query = { isActive: true };

        if (type) {
            query.type = type;
        }

        if (subType) {
            query.subType = subType;
        }

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [data, totalItems] = await Promise.all([
            NoticeAppreciation.find(query)
                .populate('user', 'name profileImage')
                .populate('project', 'name')
                .populate('awardedBy', 'name')
                .sort({ date: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            NoticeAppreciation.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalItems / parseInt(limit));

        res.status(200).json({
            success: true,
            data,
            pagination: {
                totalItems,
                totalPages,
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.addNoticeAppreciation = async (req, res, next) => {
    try {
        const { user, type, subType, project, kpiCategory, title, description, date, severity, awardedBy } = req.body;

        const newData = await NoticeAppreciation.create({
            user,
            type,
            subType,
            project: project || undefined,
            kpiCategory,
            title,
            description,
            date: date || new Date(),
            severity,
            awardedBy: awardedBy || req.user._id
        });

        res.status(201).json({
            success: true,
            data: newData
        });
    } catch (error) {
        next(error);
    }
};

exports.getNoticeAppreciationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await NoticeAppreciation.findOne({ _id: id, isActive: true })
            .populate('user', 'name profileImage email designation')
            .populate('project', 'name description')
            .populate('awardedBy', 'name designation')
            .lean();

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Notice or Appreciation not found'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};
