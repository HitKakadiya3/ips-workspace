const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { loginSchema } = require('../validators/auth.validator');

router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
