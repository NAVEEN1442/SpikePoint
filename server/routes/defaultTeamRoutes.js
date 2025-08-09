const express = require("express");
const router = express.Router();
const {
  createDefaultTeam,
  getDefaultTeam,
  addTeammate,
  removeTeammate,
  joinTournamentWithDefaultTeam,
  inviteTeammate,
  acceptInvite,
} = require("../controllers/defaultTeamController");
const { authenticate } = require("../middleware/auth");

// Create default team
router.post("/create", authenticate, createDefaultTeam);

// Get default team by captain's user ID
router.get("/:userId", authenticate, getDefaultTeam);

// Add teammate
router.post("/add-teammate", authenticate, addTeammate);

// Remove teammate
router.delete("/remove-teammate", authenticate, removeTeammate);

// Join tournament with default team
router.post("/join-tournament", authenticate, joinTournamentWithDefaultTeam);

//invite a teammate

router.post("/invite-teammate", authenticate, inviteTeammate);

//accept the invite

router.post("/accept-invite", authenticate, acceptInvite);

module.exports = router;
