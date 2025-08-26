const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createTournament, getAllTournaments , deleteTournament,markTournamentAsCompleted , getTournamentById   } = require('../controllers/tournamentController');
const router = express.Router();
const upload = require('../middleware/upload'); // Assuming you have a multer setup for file uploads


// Create a tournament (protected)
router.post('/create', upload.single("bannerImage"), authenticate,createTournament);

// Get all tournaments (public)
router.get('/all', getAllTournaments);

// DELETE /api/tournaments/:id
router.delete('/delete/:id', authenticate, deleteTournament);

router.patch('/complete/:id', authenticate, markTournamentAsCompleted);

// Get tournament by ID (public)
router.get('/:id', getTournamentById);


// Export the router 
module.exports = router;
