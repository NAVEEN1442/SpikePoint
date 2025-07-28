const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,

  bannerImage: {
    type: String, // URL or path to banner image
  },

  type: {
    type: String,
    enum: ['free', 'in-game currency', 'real money'],
    required: true,
  },

  entryFee: {
    type: Number,
    default: 0,
  },

  currencyType: {
    type: String,
    enum: ['INR', 'USD', 'coins', 'tokens'],
    default: 'INR',
  },

  prizePool: {
    type: String,
    default: "To Be Announced",
  },

  gameType: {
    type: String,
    enum: ['unrated', 'team deathmatch', 'deathmatch', 'spike rush', 'swiftplay'],
    required: true,
  },

  format: {
    type: String,
    enum: ['knockout', 'league', 'custom'],
    required: true,
  },

  customFormatDescription: {
    type: String,
  },

  registrationStart: Date,
  registrationEnd: Date,
  checkInStart: Date,
  checkInEnd: Date,
  matchStartTime: Date,

  teamSize: {
    type: String,
    enum: ["1v1", "2v2", "3v3", "4v4", "5v5"],
    required: true,
  },

  teams: [
    {
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
      teamName: String,
      teamCode: String,
      members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
    }
  ],

  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      teamName: String,
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      checkInStatus: {
        type: Boolean,
        default: false,
      }
    }
  ],

  maxParticipants: {
    type: Number,
    default: 16,
  },

  isRegistrationOpen: {
    type: Boolean,
    default: true,
  },

  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },

  tournamentStatus: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  matchResults: [
    {
      round: Number,
      teamA: String,
      teamB: String,
      winner: String,
      matchTime: Date,
    }
  ],

  rules: {
    type: String,
    default: "Standard rules apply.",
  },

  platform: {
    type: String,
    enum: ['PC', 'Mobile', 'Console', 'Cross-platform'],
    default: 'PC',
  },

  discordServerLink: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tournament', tournamentSchema);