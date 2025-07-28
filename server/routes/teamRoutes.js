const express = require("express");
const router = express.Router();
const { createTeam, joinTeam } = require("../controllers/teamController");
const { authenticate } = require("../middleware/auth");

router.post("/create", authenticate, createTeam);
router.post("/join", authenticate, joinTeam);

module.exports = router;
