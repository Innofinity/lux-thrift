const express = require('express');
const router = express.Router();
const { logActivity } = require('../controllers/activityController');

// For now, making it public for the demo, but in production, we should handle auth
router.post('/', logActivity);

module.exports = router;
