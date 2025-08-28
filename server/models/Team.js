const mongoose = require("mongoose");


const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  teamCode: {
    type: String,
    unique: true,
    required:true, // Simple 4-char code
  },

  //new field.. added
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
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


  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Team", teamSchema);
