const User = require("../models/User"); // Adjust the path as needed

// GET User Profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; 

    
    const user = await User.findById(userId)
      .populate('createdTournaments')
      .populate('activeTournaments')
      .populate('pastTournaments')
      .populate('joinedTournaments.tournament')
      .populate('activeTeams')
      .populate('defaultTeam');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUserProfile };
