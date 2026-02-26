const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

function createProjectRoutes(controller) {
  const router = express.Router();

  router.get('/projects', controller.getProjects);
  router.post('/projects', authenticateToken, controller.createProject);
  router.put('/projects/:id', authenticateToken, controller.updateProject);
  router.delete('/projects/:id', authenticateToken, controller.deleteProject);

  return router;
}

module.exports = {
  createProjectRoutes,
};
