const Tournament = require('../models/Tournament');

const User = require('../models/User'); // make sure the path is correct

exports.createTournament = async (req, res) => {
  try {
    console.log("user id : ", req.user?._id);

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

    const tournament = new Tournament({
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
    });

    await tournament.save();

    // 👉 Update user's createdTournaments field
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { createdTournaments: tournament._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: tournament,
    });

  } catch (error) {
    console.error('Create Tournament Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};


// GET /api/tournaments/all
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('createdBy', 'fullName userName email') // include creator info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tournaments,
    });
  } catch (error) {
    console.error('Fetch Tournaments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tournaments' });
  }
};

// GET /api/tournaments/:id
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'fullName userName')
      .populate('participants.user', 'fullName userName email');

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    res.status(200).json({ success: true, data: tournament });
  } catch (error) {
    console.error('Fetch Tournament By ID Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching tournament' });
  }
};

// PATCH /api/tournaments/:id/join


exports.joinTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const userId = req.user.id;
    const { teamName } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // Check if user already joined
    const alreadyJoined = tournament.participants.some(p => p.user.toString() === userId);
    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'You have already joined this tournament' });
    }

    // Check if max participants reached
    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Tournament is full' });
    }

    // Add to participants
    tournament.participants.push({
      user: userId,
      teamName: teamName || '',
    });

    // Check if team already exists
    const existingTeamIndex = tournament.teams.findIndex(t => t.teamName === teamName);
    if (existingTeamIndex >= 0) {
      // Team exists, add member
      tournament.teams[existingTeamIndex].members.push(userId);
    } else {
      // Create new team
      tournament.teams.push({
        teamName,
        members: [userId],
      });
    }

    await tournament.save();

    // Add to user's active tournaments
    await User.findByIdAndUpdate(userId, {
      $addToSet: { activeTournaments: tournamentId }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully joined tournament',
      data: tournament,
    });

  } catch (error) {
    console.error('Join Tournament Error:', error);
    res.status(500).json({ success: false, message: 'Could not join tournament' });
  }
};


exports.deleteTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;

    // 1. Find the tournament
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // 2. Remove tournament reference from the creator (admin/user)
    await User.findByIdAndUpdate(
      tournament.createdBy,
      { $pull: { createdTournaments: tournament._id } }
    );

    // 3. Delete the tournament
    await Tournament.findByIdAndDelete(tournamentId);

    res.status(200).json({
      success: true,
      message: 'Tournament deleted successfully',
    });
  } catch (error) {
    console.error('Delete Tournament Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// PATCH /api/tournaments/:id/complete
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

    // Move users from active to past tournaments
    await moveTournamentToPast(tournament._id);

    res.status(200).json({
      success: true,
      message: 'Tournament marked as completed and users updated',
      data: tournament,
    });
  } catch (error) {
    console.error('Complete Tournament Error:', error);
    res.status(500).json({ success: false, message: 'Could not complete tournament' });
  }
};

// Utility function to move a tournament from active to past for all participants
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
