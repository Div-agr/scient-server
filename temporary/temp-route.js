// routes/seedRoutes.js
const express = require('express');
const { seedClubs } = require('../temporary/temp-controller');
const router = express.Router();

// Temporary route for seeding clubs using POST
router.post('/seed-clubs', seedClubs);

module.exports = router;