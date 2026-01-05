const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.post('/test', transactionController.testTransaction);

module.exports = router;
