const express = require('express');
const router = express.Router();
const aggregateController = require('../controllers/aggregate.controller');

router.get('/stats', aggregateController.getLeaveStats);

module.exports = router;
