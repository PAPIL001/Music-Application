// Routes: Defines API endpoints and maps them to controller functions

const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

// GET /api/featured  — load songs on startup
router.get('/featured', spotifyController.featured);

// GET /api/search?q=QUERY  — search songs
router.get('/search', spotifyController.search);

module.exports = router;
