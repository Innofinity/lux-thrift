const express = require('express');
const router = express.Router();
const { getCRMInsights, getUserRecommendations } = require('../controllers/crmController');

// In a real app, add admin middleware here
router.get('/insights', getCRMInsights);
router.get('/recommendations/:userId', getUserRecommendations);

module.exports = router;
