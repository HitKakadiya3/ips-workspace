const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware, (req, res) => {
    res.json({
        message: 'User profile',
        user: req.user
    });
});
router.patch('/:userId', userController.updateProfile);
router.get('/', authMiddleware, userController.getAllUsers);

module.exports = router;
