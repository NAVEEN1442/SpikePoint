const express = require("express");
const router = express.Router();
const { createTeam, joinTeam , setDefaultTeam } = require("../controllers/teamController");
const { authenticate } = require("../middleware/auth");

router.post("/create", authenticate, createTeam);
router.post("/join", authenticate, joinTeam);
router.post("/set-default", authenticate, setDefaultTeam);

module.exports = router;
