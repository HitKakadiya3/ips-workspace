const router = require('express').Router();
const timesheetController = require('../controllers/timesheet.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All timesheet routes are protected
router.use(authMiddleware);

router.post('/', timesheetController.saveTimesheet);
// Support both /user/:userId and /:userId patterns used by clients
router.get('/admin', timesheetController.getTimesheets);
router.get('/user/:userId/daily', timesheetController.getDailyTimesheets);
router.get('/user/:userId', timesheetController.getTimesheets);
// router.get('/:userId', timesheetController.getTimesheets);
router.patch('/:id/status', timesheetController.updateTimesheetStatus);
router.delete('/:id', timesheetController.deleteTimesheet);

module.exports = router;
