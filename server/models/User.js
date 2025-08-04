const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  token: {
    type: String,
  },

  // 🌟 Tournament Tracking Fields:
  createdTournaments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
    },
  ],

  activeTournaments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
    },
  ],

  pastTournaments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
    },
  ],

  joinedTournaments: [
    {
      tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
      },
      teamName: String,
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // 🌟 Team Management Fields:
  activeTeams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
  ],

  defaultTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null,
  },

  profileImage: {
    type: String,
    default: '',
  },

  role: {
    type: String,
    enum: ['player', 'admin'],
    default: 'player',
  },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
