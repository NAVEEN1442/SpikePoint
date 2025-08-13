const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createTournament, getAllTournaments , deleteTournament,markTournamentAsCompleted , getTournamentById   } = require('../controllers/tournamentController');
const router = express.Router();


// Create a tournament (protected)
router.post('/create', authenticate,createTournament);

// Get all tournaments (public)
router.get('/all', getAllTournaments);

// DELETE /api/tournaments/:id
router.delete('/delete/:id', authenticate, deleteTournament);

router.patch('/complete/:id', authenticate, markTournamentAsCompleted);

// Get tournament by ID (public)
router.get('/:id', getTournamentById);


// Export the router 
module.exports = router;
