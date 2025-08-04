const mongoose = require("mongoose");


const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

teamCode: {
  type: String,
  unique: true,
  required: true // remove default here
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
