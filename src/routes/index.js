const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/leaves', require('./leave.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/documents', require('./document.routes'));
router.use('/transactions', require('./transaction.routes'));

router.get('/health', (req, res) => {
    res.json({ status: 'API is running' });
});

module.exports = router;
