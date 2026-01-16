const router = require('express').Router();
const announcementController = require('../controllers/announcement.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/announcements');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET /api/announcements -> Get all active announcements
router.get('/', authMiddleware, announcementController.getAnnouncements);

// POST /api/announcements -> Add a new announcement (Admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('attachment'), announcementController.addAnnouncement);

// DELETE /api/announcements/:id -> Delete (deactivate) an announcement (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, announcementController.deleteAnnouncement);

module.exports = router;
