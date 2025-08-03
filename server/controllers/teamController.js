const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
exports.createTeam = async (req, res) => {
  try {
    const { tournamentId } = req.body;
    const userId = req.user.id;

    // Check if tournament exists
    const tournament = await Tournament.findById(tournamentId);
    console.log("Tournament found:", {
      id: tournament._id,
      name: tournament.name,
      status: tournament.status
    });
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // Optional: Check if tournament has started or is full
    if (tournament.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Tournament already completed' });
    }

    // Check if user already created or joined a team in this tournament
    const existingTeam = await Team.findOne({
      tournament: tournamentId,
      members: userId,
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'You are already part of a team in this tournament',
      });
    }

    const teamCode = uuidv4().slice(0, 8).toUpperCase();

    const team = await Team.create({
      name: `Team-${teamCode}`,
      code: teamCode,
      tournament: tournamentId,
      members: [userId],
      createdBy: userId,
      captain: userId,
    });

    // Update tournament's teams array
    await Tournament.findByIdAndUpdate(tournamentId, {
      $push: {
        teams: {
          teamId: team._id,
          teamName: team.name,
          teamCode: team.code,
          members: [userId],
        },
      },
    });

    return res.status(201).json({ success: true, team });
  } catch (err) {
    console.error("Error creating team:", err);
    return res.status(500).json({ success: false, message: 'Error creating team' });
  }
};

exports.joinTeam = async (req, res) => {
  try {
    const { teamCode } = req.body;
    const userId = req.user.id;

    // Check if team exists
    const team = await Team.findOne({ code: teamCode });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check tournament existence
    const tournament = await Tournament.findById(team.tournament);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Associated tournament not found' });
    }

    // Optional: Check if tournament has ended
    if (tournament.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Tournament already completed' });
    }

    // Check if user is already part of *any* team in this tournament
    const alreadyJoined = await Team.findOne({
      tournament: team.tournament,
      members: userId,
    });

    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'You are already in a team for this tournament' });
    }

    // Check if user already in the team
    if (team.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'You are already in this team' });
    }

    // Optional: Check if team is full (set a limit e.g., 5 members)
    if (team.members.length >= 5) {
      return res.status(400).json({ success: false, message: 'Team is already full' });
    }

    team.members.push(userId);
    await team.save();

    // Update team in tournament’s `teams` array as well (optional sync)
    await Tournament.updateOne(
      { _id: team.tournament, "teams.teamId": team._id },
      { $push: { "teams.$.members": userId } }
    );

    return res.status(200).json({ success: true, team });
  } catch (err) {
    console.error("Error joining team:", err);
    return res.status(500).json({ success: false, message: 'Error joining team' });
  }
};
