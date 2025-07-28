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

  // 🌟 New Fields Below:

  createdTournaments: [
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

  profileImage: {
    type: String,
    default: '', // For future profile image support
  },

  role: {
    type: String,
    enum: ['player', 'admin'],
    default: 'player',
  },
  
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
