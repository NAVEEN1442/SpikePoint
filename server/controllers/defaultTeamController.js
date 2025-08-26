const DefaultTeam = require("../models/DefaultTeam");
const Team = require("../models/Team");
const User = require("../models/User");
const OTP = require("../models/OTP");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");
const sendOtp = require("../utils/mailSender");

// Create Default Team
exports.createDefaultTeam = async (req, res) => {
  const userId = req.user._id;

  try {
    const existing = await DefaultTeam.findOne({ captain: userId });
    if (existing) {
      return res.status(400).json({ message: "You already have a default team." });
    }

    const captain = await User.findById(userId);
    if (!captain) return res.status(404).json({ message: "Captain not found" });

    const newTeam = new DefaultTeam({ captain: userId, teammates: [] });
    await newTeam.save();

    res.status(201).json({ message: "Default team created", team: newTeam });
  } catch (err) {
    res.status(500).json({ message: "Error creating team", error: err.message });
  }
};

// Get Default Team (by captain ID)
exports.getDefaultTeam = async (req, res) => {
  const { userId } = req.params;

  try {
    const team = await DefaultTeam.findOne({ captain: userId })
      .populate("captain", "userName fullName email")
      .populate("teammates", "userName fullName email");

    if (!team) return res.status(404).json({ message: "No default team found." });

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: "Error fetching team", error: err.message });
  }
};

// Add Teammate (only captain)
exports.addTeammate = async (req, res) => {
  const userId = req.user._id;
  const { username } = req.body;

  try {
    const team = await DefaultTeam.findOne({ captain: userId });
    if (!team) return res.status(404).json({ message: "You don't have a default team." });

    if (team.teammates.length >= 6) {
      return res.status(400).json({ message: "Max 6 players allowed (5 main + 1 substitute)." });
    }

    const userToAdd = await User.findOne({ userName: username });
    if (!userToAdd) return res.status(404).json({ message: "User not found." });

    if (team.teammates.some(id => id.toString() === userToAdd._id.toString())) {
      return res.status(400).json({ message: "User is already in your team." });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    
    const uniqueOtp = crypto
      .createHash("sha256")
      .update(otp + userToAdd.email + Date.now())
      .digest("hex")
      .substring(0, 6);

    // Save OTP to DB 
    await OTP.create({ email: userToAdd.email, otp: uniqueOtp });

    // Push teammate after sending OTP
    team.teammates.push(userToAdd._id);
    await team.save();

    res.status(200).json({
      message: "Teammate added and OTP sent via email.",
      otpSentTo: userToAdd.email,
      team,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding teammate", error: err.message });
  }
};

// Remove Teammate (only captain)
exports.removeTeammate = async (req, res) => {
  const userId = req.user._id;
  const { teammateId } = req.body;

  try {
    const team = await DefaultTeam.findOne({ captain: userId });
    if (!team) return res.status(404).json({ message: "You don't have a default team." });

    if (!team.teammates.some(id => id.toString() === teammateId)) {
      return res.status(400).json({ message: "User is not in your team." });
    }

    team.teammates = team.teammates.filter(id => id.toString() !== teammateId);
    await team.save();

    res.status(200).json({ message: "Teammate removed.", team });
  } catch (err) {
    res.status(500).json({ message: "Error removing teammate", error: err.message });
  }
};

// Join Tournament using DefaultTeam (captain only)
exports.joinTournamentWithDefaultTeam = async (req, res) => {
  const userId = req.user._id;
  const { tournamentId } = req.body;

  try {
    const defaultTeam = await DefaultTeam.findOne({ captain: userId });
    if (!defaultTeam) return res.status(404).json({ message: "You don't have a default team." });

    const newTournamentTeam = new Team({
      name: `DefaultTeam-${userId}`,
      teamCode: `DEF-${Date.now()}`,
      captain: defaultTeam.captain,
      members: defaultTeam.teammates,
      tournament: tournamentId,
      createdBy: userId,
    });

    await newTournamentTeam.save();
    res.status(201).json({ message: "Joined tournament using default team", team: newTournamentTeam });
  } catch (err) {
    res.status(500).json({ message: "Error joining tournament", error: err.message });
  }
};

// Invite Teammate
exports.inviteTeammate = async (req, res) => {
  try {
    const { username } = req.body; //username
    const captainId = req.user._id;

    const team = await DefaultTeam.findOne({ captain: captainId });
    if (!team) {
      return res.status(404).json({ message: "Captain's team not found" });
    }

    const userToInvite = await User.findOne({ userName: username });
    if (!userToInvite) {
      return res.status(404).json({ message: "User not found" });
    }

    if (team.teammates.some(id => id.toString() === userToInvite._id.toString())) {
      return res.status(400).json({ message: "User is already in your team" });
    }

    if (!team.pendingInvites) team.pendingInvites = [];

    if (!team.pendingInvites.some(id => id.toString() === userToInvite._id.toString())) {
      team.pendingInvites.push(userToInvite._id);
    }

    await team.save();

    await sendOtp(userToInvite.email, "team_invite");

    return res.status(200).json({ message: "Invitation sent" });
  } catch (error) {
    console.error("Error inviting teammate:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Accept Invite
exports.acceptInvite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "teamId is required" });
    }

    const team = await DefaultTeam.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (
      !team.pendingInvites ||
      !team.pendingInvites.some(id => id.toString() === userId.toString())
    ) {
      return res.status(400).json({ message: "No pending invite for this user" });
    }

    team.pendingInvites = team.pendingInvites.filter(id => id.toString() !== userId.toString());

    if (!team.teammates.some(id => id.toString() === userId.toString())) {
      team.teammates.push(userId);
    }

    await team.save();

    return res.status(200).json({ message: "Invite accepted", team });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
