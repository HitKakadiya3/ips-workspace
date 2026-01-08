const router = require('express').Router();
const documentController = require('../controllers/document.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/documents');
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

router.post('/', authMiddleware, upload.array('files'), documentController.uploadDocument);
router.get('/', authMiddleware, documentController.getDocuments);
router.get('/download/:filename', authMiddleware, documentController.downloadDocument);
router.delete('/:id', authMiddleware, documentController.deleteDocument);

module.exports = router;
