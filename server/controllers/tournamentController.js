const Tournament = require('../models/Tournament');
const User = require('../models/User');
const Team = require("../models/Team");
const cloudinary = require('../config/cloudinary'); // Assuming you have a cloudinary utility set up

const streamifier = require("streamifier");

exports.createTournament = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      entryFee,
      gameType,
      format,
      registrationStart,
      registrationEnd,
      checkInStart,
      checkInEnd,
      matchStartTime,
      teamSize,
      maxParticipants,
      prizePool,
      rules,
      discordServerLink,
    } = req.body;

    // ✅ Required field validation
    if (!name || !type || !gameType || !format || !registrationStart || !registrationEnd || !teamSize) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Entry fee rules
    let finalEntryFee = 0;
    if (type === "free") {
      finalEntryFee = 0;
    } else {
      if (!entryFee || entryFee <= 0) {
        return res.status(400).json({ success: false, message: "Entry fee must be greater than 0 for paid tournaments" });
      }
      finalEntryFee = entryFee;
    }

    // ✅ Upload banner to Cloudinary if file provided
    let bannerImage = null;
    if (req.file) {
      console.log("Uploading banner image to Cloudinary...");

      bannerImage = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "tournaments" },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              public_id: result.public_id, // 👈 store this too
            });
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    }

    console.log("Banner Image:", bannerImage);

    // ✅ Prepare data
    const tournamentData = {
      name,
      description,
      bannerImage, // 👈 object with url + public_id
      type,
      entryFee: finalEntryFee,
      gameType,
      format,
      registrationStart,
      registrationEnd,
      checkInStart,
      checkInEnd,
      matchStartTime,
      teamSize,
      maxParticipants: maxParticipants || 16,
      prizePool: prizePool || "To Be Announced",
      rules: rules || "Standard rules apply.",
      discordServerLink,
      createdBy: req.user._id,
    };

    // ✅ Create tournament
    const tournament = await Tournament.create(tournamentData);

    // ✅ Add tournament to user’s created list
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { createdTournaments: tournament._id } },
      { new: true }
    );

    // ✅ Emit socket event
    const io = req.app.get("io");
    io.emit("tournament_created", tournament);
    console.log("📢 Tournament created:", tournament._id);

    return res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament,
    });

  } catch (error) {
    console.error("❌ Create Tournament Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get All Tournaments
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('createdBy', 'fullName userName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tournaments,
    });
  } catch (error) {
    console.error('Fetch Tournaments Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch tournaments' });
  }
};

// Get Tournament by ID
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'fullName userName')
      .populate('participants.user', 'fullName userName email')
      .populate('teams.members', 'fullName userName email');

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    return res.status(200).json({ success: true, data: tournament });
  } catch (error) {
    console.error('Fetch Tournament By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching tournament' });
  }
};

exports.deleteTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;

    const tournament = await Tournament.findById(tournamentId).populate("teams.teamId");
    if (!tournament) {
      return res.status(404).json({ success: false, message: "Tournament not found" });
    }

    console.log("Deleting tournament and  image:", tournament?.bannerImage);


    // 0️⃣ Delete tournament banner from Cloudinary (if exists)
    if (tournament?.bannerImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(tournament?.bannerImage?.public_id);
        console.log("🖼 Cloudinary image deleted:", tournament.bannerImage.public_id);
      } catch (err) {
        console.error("⚠️ Error deleting image from Cloudinary:", err.message);
      }
    }

    // 1️⃣ Remove from creator’s createdTournaments
    await User.findByIdAndUpdate(
      tournament.createdBy,
      { $pull: { createdTournaments: tournament._id } }
    );

    // 2️⃣ Remove from ALL users’ activeTournaments + joinedTournaments
    await User.updateMany(
      {},
      {
        $pull: {
          activeTournaments: tournament._id,
          joinedTournaments: { tournament: tournament._id },
        },
      }
    );

    // 3️⃣ Remove teams of this tournament
    const teamIds = tournament.teams.map((t) => t.teamId);

    if (teamIds.length > 0) {
      // Remove from users’ activeTeams
      await User.updateMany(
        { activeTeams: { $in: teamIds } },
        { $pull: { activeTeams: { $in: teamIds } } }
      );

      // Delete teams
      await Team.deleteMany({ _id: { $in: teamIds } });
    }

    // 4️⃣ Delete tournament
    await Tournament.findByIdAndDelete(tournamentId);

    // 5️⃣ Emit socket event
    const io = req.app.get("io");
    io.emit("tournament_deleted", { id: tournamentId });
    console.log("🗑 Tournament deleted and event emitted:", tournamentId);

    return res.status(200).json({
      success: true,
      message: "Tournament, teams, and related data deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Tournament Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// exports.markTournamentAsCompleted = async (req, res) => {
//   try {
//     const tournament = await Tournament.findByIdAndUpdate(
//       req.params.id,
//       { tournamentStatus: 'completed'},
//       { new: true }
//     );

//     if (!tournament) {
//       return res.status(404).json({ success: false, message: 'Tournament not found' });
//     }

//     await moveTournamentToPast(tournament._id);

//     // 🔹 Emit event
//     const io = req.app.get("io");
//     io.emit("tournament_completed", tournament);
//     console.log("🏁 Tournament completed event emitted:", tournament._id);

//     return res.status(200).json({
//       success: true,
//       message: 'Tournament marked as completed and users updated',
//       data: tournament,
//     });
//   } catch (error) {
//     console.error('❌ Complete Tournament Error:', error);
//     return res.status(500).json({ success: false, message: 'Could not complete tournament' });
//   }
// };


// Utility: Move from active to past tournaments

// exports.updateTournamentStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const validStatuses = ["upcoming", "ongoing", "completed", "cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status" });
//     }

//     const tournament = await Tournament.findByIdAndUpdate(
//       req.params.id,
//       { tournamentStatus: status },   // ✅ correct field
//       { new: true }
//     );

//     if (!tournament) {
//       return res.status(404).json({ success: false, message: "Tournament not found" });
//     }

//     // 🔹 If tournament completed, move to past
//     if (status === "completed") {
//       await moveTournamentToPast(tournament._id);
//     }

//     // 🔹 Emit socket events (optional if you’re using sockets)
//     const io = req.app.get("io");
//     if (io) {
//       io.emit("tournament_updated", tournament);         // generic
//       io.emit(`tournament_${status}`, tournament);       // status-specific
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Tournament marked as ${status}`,
//       data: tournament,
//     });
//   } catch (error) {
//     console.error("❌ Update Tournament Status Error:", error);
//     return res.status(500).json({ success: false, message: "Could not update status" });
//   }
// };


exports.updateTournamentStatus = async (req, res) => {
  try {
    // 🔹 Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized: Admins only" });
    }

    const { status } = req.body;
    const validStatuses = ["upcoming", "ongoing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { tournamentStatus: status },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ success: false, message: "Tournament not found" });
    }

    if (status === "completed") {
      await moveTournamentToPast(tournament._id);
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("tournament_updated", tournament);
      io.emit(`tournament_${status}`, tournament);
    }

    return res.status(200).json({
      success: true,
      message: `Tournament marked as ${status}`,
      data: tournament,
    });
  } catch (error) {
    console.error("❌ Update Tournament Status Error:", error);
    return res.status(500).json({ success: false, message: "Could not update status" });
  }
};





const moveTournamentToPast = async (tournamentId) => {
  const tournament = await Tournament.findById(tournamentId).populate('participants.user');

  if (!tournament) return;

  const participantIds = tournament.participants.map(p => p.user._id);

  await User.updateMany(
    { _id: { $in: participantIds } },
    {
      $pull: { activeTournaments: tournamentId },
      $addToSet: { pastTournaments: tournamentId },
    }
  );
};
