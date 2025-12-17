const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware, (req, res) => {
    res.json({
        message: 'User profile',
        user: req.user
    });
});

module.exports = router;
