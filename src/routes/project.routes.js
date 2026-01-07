const router = require('express').Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All project routes are protected
router.use(authMiddleware);

router.get('/', projectController.getProjects);
router.get('/:projectId', projectController.getProjectById);
router.get('/user/:userId', projectController.getProjectsByUserId);

module.exports = router;
