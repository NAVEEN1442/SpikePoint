const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Create Team
exports.createTeam = async (req, res) => {
  try {
    const { tournamentId, teamName } = req.body;
    const userId = req.user.id;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    if (tournament.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Tournament already completed' });
    }

    const existingTeam = await Team.findOne({ tournament: tournamentId, members: userId });
    if (existingTeam) {
      return res.status(400).json({ success: false, message: 'You are already part of a team in this tournament' });
    }

    const teamCode = Math.random().toString(36).substr(2, 5).toUpperCase();

    const team = await Team.create({
      name: teamName,
      teamCode,
      tournament: tournamentId,
      members: [userId],
      createdBy: userId,
      captain: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        activeTeams: team._id,
        activeTournaments: tournamentId,
      },
    });

    await Tournament.findByIdAndUpdate(tournamentId, {
      $push: {
        teams: {
          teamId: team._id,
          teamName: team.name,
          teamCode: team.teamCode,
          members: [userId],
        },
        participants: {
          _id: userId,
          joinedAt: new Date(),
          checkInStatus: false,
        },
      },
    });

  
   

    return res.status(201).json({
      success: true,
      message: 'Team created successfully',
      teamCode,
      team,
    });
  } catch (err) {
    console.error("Error creating team:", err);
    return res.status(500).json({ success: false, message: 'Error creating team' });
  }
};

// Join Team
exports.joinTeam = async (req, res) => {
  try {
    const { teamCode, tournamentId } = req.body;
    const userId = req.user.id;

    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const tournament = await Tournament.findById(team.tournament);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Associated tournament not found' });
    }

    if (tournament.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Tournament already completed' });
    }

    const alreadyJoined = await Team.findOne({ tournament: team.tournament, members: userId });
    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'You are already in a team for this tournament' });
    }

    if (team.members.length >= 5) {
      return res.status(400).json({ success: false, message: 'Team is already full' });
    }

    team.members.push(userId);
    await team.save();

    await User.findByIdAndUpdate(userId, {
      $push: {
        activeTeams: team._id,
        activeTournaments: tournamentId,
      },
    });

    await Tournament.updateOne(
      { _id: team.tournament, "teams.teamId": team._id },
      { $push: { "teams.$.members": userId } }
    );

    await Tournament.findByIdAndUpdate(tournamentId, {
      $push: {
        participants: {
          _id: userId,
          joinedAt: new Date(),
          checkInStatus: false,
        },
      },
    });

    

    return res.status(200).json({
      success: true,
      message: 'Joined team successfully',
      team,
    });
  } catch (err) {
    console.error("Error joining team:", err);
    return res.status(500).json({ success: false, message: 'Error joining team' });
  }
};

// Set Default Team
exports.setDefaultTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team || !team.members.includes(userId)) {
      return res.status(403).json({ success: false, message: "You're not a member of this team" });
    }

    await User.findByIdAndUpdate(userId, { defaultTeam: teamId });
    return res.status(200).json({ success: true, message: 'Default team set successfully' });
  } catch (err) {
    console.error("Error setting default team:", err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Scheduled Clean-up for Completed Tournaments
const cron = require('node-cron');

cron.schedule('0 * * * *', async () => {
  try {
    const completedTournaments = await Tournament.find({ status: 'completed' });

    for (const tournament of completedTournaments) {
      const teams = await Team.find({ tournament: tournament._id });

      for (const team of teams) {
        await User.updateMany(
          { activeTeams: team._id },
          { $pull: { activeTeams: team._id } }
        );
      }

      await Team.deleteMany({ tournament: tournament._id }); // optional
    }

    console.log("Clean-up for completed tournaments done.");
  } catch (error) {
    console.error("Scheduled cleanup error:", error);
  }
});
