import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTournamentById, createTeamForTournament } from "../Services/operations/tournamentAPI";
import { joinTeamForTournament } from "../Services/operations/teamAPI";
import { Calendar, Clock, Users, Trophy, Gamepad2, Monitor } from "lucide-react";

function TournamentDetails() {
  const { id: tournamentId } = useParams();
  const dispatch = useDispatch();

  const [tournamentDetails, setTournamentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [showTeamModal, setShowTeamModal] = useState(false);

  const userId = useSelector((state) => state.auth?.user?._id);

  // Check if user already joined tournament
  const hasUserJoined = tournamentDetails?.participants?.some(
    (p) => p?._id?.toString() === userId?.toString()
  );

  // Find team user belongs to
  const userTeam = tournamentDetails?.teams?.find((team) =>
    team?.members?.some((member) => member?._id?.toString() === userId?.toString())
  );

  // Fetch tournament details
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        console.info("[Tournament] Fetching details for:", tournamentId);
        const response = await dispatch(getTournamentById(tournamentId));

        if (response) {
          setTournamentDetails(response);
          toast.success("Tournament details fetched successfully!");
        } else {
          toast.error("No tournament data found.");
        }
      } catch (error) {
        console.error("[Tournament] Fetch error:", error);
        toast.error("Failed to fetch tournament details");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [dispatch, tournamentId]);

  // Create team
  const handleCreateTeam = async () => {
    if (!teamName.trim()) return toast.error("Team name is required");

    try {
      const response = await dispatch(createTeamForTournament({ tournamentId, teamName }));

      if (response?.success && response?.team) {
        setTournamentDetails((prev) => ({
          ...prev,
          participants: [...(prev?.participants || []), { _id: userId }],
          teams: [...(prev?.teams || []), response.team],
        }));

        setIsModalOpen(false);
        setTeamName("");
        toast.success("Team created successfully!");
      }
    } catch (err) {
      console.error("[Team] Create failed:", err);
      toast.error("Failed to create team");
    }
  };

  // Join team
  const handleJoinTeam = async () => {
    if (!teamCode.trim()) return toast.error("Team code is required");

    try {
      const response = await dispatch(joinTeamForTournament({ tournamentId, teamCode }));

      if (response?.success) {
        setTournamentDetails((prev) => {
          const updatedTeams = prev?.teams?.map((team) =>
            team?.teamCode === teamCode
              ? { ...team, members: [...(team?.members || []), { _id: userId }] }
              : team
          );

          return {
            ...prev,
            participants: [...(prev?.participants || []), { _id: userId }],
            teams: updatedTeams,
          };
        });

        setIsModalOpen(false);
        setTeamCode("");
        toast.success("Successfully joined the team!");
      }
    } catch (err) {
      console.error("[Team] Join failed:", err);
      toast.error("Failed to join team");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ongoing':
        return 'text-green-400';
      case 'completed':
        return 'text-blue-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "bracket", label: "Bracket" },
    { id: "matches", label: "Matches" },
    { id: "teams", label: "Teams" },
    { id: "results", label: "Results" }
  ];

  const timelineEvents = [
    { label: "Registration Start", date: tournamentDetails?.registrationStart, icon: Calendar },
    { label: "Registration End", date: tournamentDetails?.registrationEnd, icon: Calendar },
    { label: "Check-in Start", date: tournamentDetails?.checkInStart, icon: Clock },
    { label: "Check-in End", date: tournamentDetails?.checkInEnd, icon: Clock },
    { label: "Tournament Start", date: tournamentDetails?.matchStartTime, icon: Gamepad2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl">Loading tournament...</div>
        </div>
      </div>
    );
  }

  if (!tournamentDetails) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center text-red-400 text-xl">Tournament not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Hero Section with Banner */}
      <div 
        className="relative min-h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: tournamentDetails?.bannerImage?.url 
            ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${tournamentDetails.bannerImage.url})`
            : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-12 flex items-center min-h-96">
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
              {tournamentDetails?.name || "Unnamed Tournament"}
            </h1>
            <p className="text-xl text-gray-200 mb-6 max-w-2xl leading-relaxed">
              {tournamentDetails?.description || "No description available."}
            </p>
            
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>Starts: {formatDate(tournamentDetails?.matchStartTime)}</span>
              </div>
              <div className={`flex items-center gap-2 ${getStatusColor(tournamentDetails?.status)}`}>
                <div className="w-3 h-3 rounded-full bg-current animate-pulse"></div>
                <span className="font-semibold">{tournamentDetails?.status || "Pending"}</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 ml-8">
            {hasUserJoined ? (
              <button
                onClick={() => setShowTeamModal(true)}
                className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Users className="w-5 h-5 inline mr-2" />
                View Team
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-600 hover:bg-yellow-700 px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Trophy className="w-5 h-5 inline mr-2" />
                Join Tournament
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeSection === section.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-8">
        {activeSection === "overview" && (
          <div className="space-y-8">
            {/* Tournament Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Gamepad2 className="w-6 h-6 text-blue-400" />
                  <h3 className="font-semibold text-white">Game Type</h3>
                </div>
                <p className="text-gray-300">{tournamentDetails?.gameType || "N/A"}</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Monitor className="w-6 h-6 text-green-400" />
                  <h3 className="font-semibold text-white">Platform</h3>
                </div>
                <p className="text-gray-300">{tournamentDetails?.platform || "N/A"}</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  <h3 className="font-semibold text-white">Team Size</h3>
                </div>
                <p className="text-gray-300">{tournamentDetails?.teamSize || "N/A"}</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="font-semibold text-white">Prize Pool</h3>
                </div>
                <p className="text-gray-300">{tournamentDetails?.prizePool || "N/A"}</p>
              </div>
            </div>

            {/* Tournament Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Timeline */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-yellow-400" />
                  Tournament Timeline
                </h3>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => {
                    const IconComponent = event.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-white">{event.label}</h4>
                            <span className="text-sm text-gray-400 ml-4 whitespace-nowrap">
                              {formatDate(event.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-6">
                {/* Tournament Info */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-white">Tournament Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{tournamentDetails?.type || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span className="text-white">{tournamentDetails?.format || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Fee:</span>
                      <span className="text-white">₹{tournamentDetails?.entryFee ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created By:</span>
                      <span className="text-white">{tournamentDetails?.createdBy?.fullName || "Unknown"}</span>
                    </div>
                  </div>
                </div>

                {/* Rules & Discord */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-white">Rules & Communication</h3>
                  <div className="space-y-4">
                    {tournamentDetails?.rules && (
                      <div>
                        <h4 className="font-medium text-yellow-400 mb-2">Tournament Rules</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {tournamentDetails.rules}
                        </p>
                      </div>
                    )}
                    
                    {tournamentDetails?.discordServerLink && (
                      <div>
                        <h4 className="font-medium text-yellow-400 mb-2">Discord Server</h4>
                        <a
                          href={tournamentDetails.discordServerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.195.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                          Join Discord
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "bracket" && (
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
            <h3 className="text-2xl font-semibold mb-4">Tournament Bracket</h3>
            <p className="text-gray-400">Bracket will be available once the tournament starts.</p>
          </div>
        )}

        {activeSection === "matches" && (
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
            <h3 className="text-2xl font-semibold mb-4">Matches</h3>
            <p className="text-gray-400">Match schedule will be posted here.</p>
          </div>
        )}

        {activeSection === "teams" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Registered Teams</h3>
              <span className="text-gray-400">
                {tournamentDetails?.teams?.length || 0} Teams Registered
              </span>
            </div>
            
            {tournamentDetails?.teams?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournamentDetails.teams.map((team, index) => (
                  <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">{team?.teamName || `Team ${index + 1}`}</h4>
                    <p className="text-sm text-gray-400 mb-3">Code: {team?.teamCode || "N/A"}</p>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Members:</p>
                      <ul className="space-y-1">
                        {team?.members?.map((member, memberIndex) => (
                          <li key={memberIndex} className="text-sm text-gray-300">
                            {typeof member === "object"
                              ? `${member?.fullName || "Unknown"} (${member?.userName || "N/A"})`
                              : member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
                <p className="text-gray-400">No teams registered yet.</p>
              </div>
            )}
          </div>
        )}

        {activeSection === "results" && (
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
            <h3 className="text-2xl font-semibold mb-4">Tournament Results</h3>
            <p className="text-gray-400">Results will be posted after the tournament concludes.</p>
          </div>
        )}
      </div>

      {/* Create / Join Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white text-black rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <div className="flex justify-between mb-4">
              <button
                className={`w-1/2 py-2 rounded-l ${activeTab === "create" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTab("create")}
              >
                Create Team
              </button>
              <button
                className={`w-1/2 py-2 rounded-r ${activeTab === "join" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTab("join")}
              >
                Join Team
              </button>
            </div>

            {activeTab === "create" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-center">Create Team</h2>
                <input
                  type="text"
                  placeholder="Enter Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                />
              </>
            )}

            {activeTab === "join" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-center">Join Team</h2>
                <input
                  type="text"
                  placeholder="Enter Team Code"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                />
              </>
            )}

            <div className="flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={activeTab === "create" ? handleCreateTeam : handleJoinTeam}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {activeTab === "create" ? "Create & Join" : "Join Team"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Team Modal */}
      {showTeamModal && userTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-800">Your Team</h2>

            <p><strong>Team Name:</strong> {userTeam?.teamName || "N/A"}</p>
            <p><strong>Team Code:</strong> {userTeam?.teamCode || "N/A"}</p>

            <div className="mt-4">
              <p className="font-semibold mb-1">Members:</p>
              <ul className="list-disc list-inside">
                {userTeam?.members?.map((member, index) => (
                  <li key={index}>
                    {typeof member === "object"
                      ? `${member?.fullName || "Unknown"} (${member?.userName || "N/A"})`
                      : member}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTeamModal(false)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TournamentDetails;