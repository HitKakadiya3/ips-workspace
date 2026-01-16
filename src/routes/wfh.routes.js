const router = require('express').Router();
const wfhController = require('../controllers/wfh.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// POST /api/wfh -> Apply for WFH
router.post('/', authMiddleware, wfhController.applyWFH);

// GET /api/wfh -> Get all WFH requests (Admin only)
router.get('/', authMiddleware, adminMiddleware, wfhController.getWFHRequests);

// GET /api/wfh/user/:userId -> Get WFH requests for a specific user
router.get('/user/:userId', authMiddleware, wfhController.getWFHRequestsByUser);

// PATCH /api/wfh/:id/status -> Update WFH request status (Admin only)
router.patch('/:id/status', authMiddleware, adminMiddleware, wfhController.updateWFHStatus);

module.exports = router;
