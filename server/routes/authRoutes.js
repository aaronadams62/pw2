const express = require('express');

function createAuthRoutes(controller) {
  const router = express.Router();
  router.post('/login', controller.login);
  return router;
}

module.exports = {
  createAuthRoutes,
};
