const router = require('express').Router();
const leaveController = require('../controllers/leave.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/leaves/user/:userId/count
router.get('/user/:userId/count', authMiddleware, leaveController.getLeaveCountsByType);

// GET /api/leaves/user/:userId  -> returns list of leaves for the user (optional ?year=YYYY)
router.get('/user/:userId', authMiddleware, leaveController.getLeavesByUser);

// POST /api/leaves/user/:userId
router.post('/user/:userId', authMiddleware, leaveController.addLeave);

// GET /api/leaves/:id  -> fetch single leave by id
router.get('/:id', authMiddleware, leaveController.getLeaveById);

module.exports = router;
