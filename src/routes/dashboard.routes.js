const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/:userId', dashboardController.getDashboardData);

module.exports = router;
