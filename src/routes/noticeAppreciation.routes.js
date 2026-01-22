const express = require('express');
const router = express.Router();
const noticeAppreciationController = require('../controllers/noticeAppreciation.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', authMiddleware, noticeAppreciationController.getNoticeAppreciations);
router.get('/:id', authMiddleware, noticeAppreciationController.getNoticeAppreciationById);
router.post('/', authMiddleware, adminMiddleware, noticeAppreciationController.addNoticeAppreciation);
router.delete('/:id', authMiddleware, adminMiddleware, noticeAppreciationController.deleteNoticeAppreciation);

module.exports = router;
