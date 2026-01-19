const express = require('express');
const router = express.Router();
const noticeAppreciationController = require('../controllers/noticeAppreciation.controller');
// Assuming auth middleware exists as seen in other files implicitly or explicitly
// const { protect, authorize } = require('../middleware/auth'); 

router.get('/', noticeAppreciationController.getNoticeAppreciations);
router.post('/', noticeAppreciationController.addNoticeAppreciation);

module.exports = router;
