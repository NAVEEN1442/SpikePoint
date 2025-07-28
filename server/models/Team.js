const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  teamCode: {
    type: String,
    unique: true,
    default: () => uuidv4().split('-')[0], // Simple 4-char code
  },

  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Team", teamSchema);
