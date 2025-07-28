const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createTournament, getAllTournaments } = require('../controllers/tournamentController');
const router = express.Router();


// Create a tournament (protected)
router.post('/create', authenticate,createTournament);

// Get all tournaments (public)
router.get('/all', getAllTournaments);

module.exports = router;
