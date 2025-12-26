const router = require('express').Router();
const leaveController = require('../controllers/leave.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/leaves/:userId/count
router.get('/:userId/count', authMiddleware, leaveController.getLeaveCountsByType);

// POST /api/leaves/:userId
router.post('/:userId', authMiddleware, leaveController.addLeave);

module.exports = router;
