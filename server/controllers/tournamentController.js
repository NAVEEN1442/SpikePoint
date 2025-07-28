const Tournament = require('../models/Tournament');

// POST /api/tournaments/create
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

    // Validate required fields
    if (!name || !type || !gameType || !format || !registrationStart || !registrationEnd || !teamSize) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    console.log(matchStartTime);


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
      createdBy: req.user.id, // assuming user ID is set by auth middleware
    });

    await tournament.save();

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
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ success: false, message: 'Tournament not found' });

    // Check if user already joined
    const alreadyJoined = tournament.participants.some(
      (p) => p.user.toString() === req.user.id
    );
    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'You have already joined this tournament' });
    }

    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Tournament is full' });
    }

    tournament.participants.push({
      user: req.user.id,
      teamName: req.body.teamName || '',
    });

    await tournament.save();

    res.status(200).json({ success: true, message: 'Successfully joined tournament', data: tournament });
  } catch (error) {
    console.error('Join Tournament Error:', error);
    res.status(500).json({ success: false, message: 'Could not join tournament' });
  }
};
