const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');

function createUploadRoutes(controller) {
  const router = express.Router();
  router.post('/upload', authenticateToken, upload.single('image'), controller.uploadImage);
  return router;
}

module.exports = {
  createUploadRoutes,
};
