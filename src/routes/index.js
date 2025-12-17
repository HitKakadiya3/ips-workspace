const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));

router.get('/health', (req, res) => {
    res.json({ status: 'API is running' });
});

module.exports = router;
