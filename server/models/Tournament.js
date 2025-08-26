const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,

   bannerImage: {
    url: { type: String },       // Cloudinary secure_url
    public_id: { type: String }, // Cloudinary public_id
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
    enum: ['knockout', 'league'],
    required: true,
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

  discordServerLink: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tournament', tournamentSchema);