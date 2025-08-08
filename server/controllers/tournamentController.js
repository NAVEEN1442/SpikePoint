const Tournament = require('../models/Tournament');
const User = require('../models/User');

// Create Tournament
exports.createTournament = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      entryFee,
      gameType,
      format,
      customFormatDescription,
      registrationStart,
      registrationEnd,
      checkInStart,
      checkInEnd,
      matchStartTime,
      teamSize,
      maxParticipants,
    } = req.body;

    if (!name || !type || !gameType || !format || !registrationStart || !registrationEnd || !teamSize) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const tournamentData = {
      name,
      description,
      type,
      entryFee: type === 'free' ? 0 : entryFee || 0,
      gameType,
      format,
      customFormatDescription: format === 'custom' ? customFormatDescription : '',
      registrationStart,
      registrationEnd,
      checkInStart,
      checkInEnd,
      matchStartTime,
      teamSize,
      maxParticipants: maxParticipants || 16,
      createdBy: req.user._id,
    };

    const tournament = await Tournament.create(tournamentData);

    // Add to creator's list
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { createdTournaments: tournament._id } },
      { new: true }
    );



    return res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: tournament,
    });

  } catch (error) {
    console.error('Create Tournament Error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Get All Tournaments
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('createdBy', 'fullName userName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tournaments,
    });
  } catch (error) {
    console.error('Fetch Tournaments Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch tournaments' });
  }
};

// Get Tournament by ID
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'fullName userName')
      .populate('participants.user', 'fullName userName email')
      .populate('teams.members', 'fullName userName email');

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    return res.status(200).json({ success: true, data: tournament });
  } catch (error) {
    console.error('Fetch Tournament By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching tournament' });
  }
};

// Delete Tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    await User.findByIdAndUpdate(
      tournament.createdBy,
      { $pull: { createdTournaments: tournament._id } }
    );

    await Tournament.findByIdAndDelete(tournamentId);

  

    return res.status(200).json({
      success: true,
      message: 'Tournament deleted successfully',
    });
  } catch (error) {
    console.error('Delete Tournament Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Mark Tournament as Completed
exports.markTournamentAsCompleted = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { tournamentStatus: 'completed', status: 'completed' },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // Move participants to past
    await moveTournamentToPast(tournament._id);



    return res.status(200).json({
      success: true,
      message: 'Tournament marked as completed and users updated',
      data: tournament,
    });
  } catch (error) {
    console.error('Complete Tournament Error:', error);
    return res.status(500).json({ success: false, message: 'Could not complete tournament' });
  }
};

// Utility: Move from active to past tournaments
const moveTournamentToPast = async (tournamentId) => {
  const tournament = await Tournament.findById(tournamentId).populate('participants.user');

  if (!tournament) return;

  const participantIds = tournament.participants.map(p => p.user._id);

  await User.updateMany(
    { _id: { $in: participantIds } },
    {
      $pull: { activeTournaments: tournamentId },
      $addToSet: { pastTournaments: tournamentId },
    }
  );
};
