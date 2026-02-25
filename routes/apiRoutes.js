const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

router.get('/featured', spotifyController.getFeatured);
router.get('/search', spotifyController.search);

module.exports = router;
