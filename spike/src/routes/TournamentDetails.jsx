import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTournamentById } from '../Services/operations/tournamentAPI';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTeamForTournament } from "../Services/operations/tournamentAPI";
import { useSelector } from 'react-redux';
import { joinTeamForTournament } from '../Services/operations/teamAPI';

function TournamentDetails() {
  const { id: tournamentId } = useParams();
  const dispatch = useDispatch();
  const [tournamentDetails, setTournamentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [activeTab, setActiveTab] = useState("create"); // "create" or "join"
const [teamName, setTeamName] = useState("");
const [teamCode, setTeamCode] = useState("");

const [showTeamModal, setShowTeamModal] = useState(false);


const userId = useSelector((state) => state.auth?.user?._id);


const hasUserJoined = tournamentDetails?.participants?.some(
  (p) => p._id?.toString() === userId?.toString()
);


console.log("Has user joined:", hasUserJoined);

console.log("User ID:", userId);
console.log("Teams:", tournamentDetails?.teams);
console.log("Members in team[0]:", tournamentDetails?.teams?.[0]?.members);


const userTeam = tournamentDetails?.teams?.find(team =>
  team.members?.some(member => member._id?.toString() === userId?.toString())
);





useEffect(() => {
console.log("tournamentDetails", tournamentDetails);
}
,[tournamentDetails])


const handleCreateTeam = async () => {
  if (!teamName.trim()) {
    return toast.error("Team name is required");
  }

  try {
    const response = await dispatch(
      createTeamForTournament({ tournamentId, teamName })
    );

    if (response?.success) {
      // ✅ Manually update tournamentDetails state
      setTournamentDetails((prev) => ({
        ...prev,
        participants: [
          ...(prev?.participants || []),
          { _id: userId }, // Simulate participant
        ],
        teams: [
          ...(prev?.teams || []),
          {
            teamId: response.team._id,
            teamName: response.team.teamName,
            teamCode: response.team.teamCode,
            members: response.team.members,
          },
        ],
      }));

      setIsModalOpen(false);
      setTeamName("");
    }
  } catch (err) {
    console.error("Create team failed", err);
  }
};
const handleJoinTeam = async () => {
  if (!teamCode.trim()) {
    return toast.error("Team code is required");
  }

  try {
    const response = await dispatch(
      joinTeamForTournament({ tournamentId, teamCode })
    );

    if (response?.success) {
      toast.success("Successfully joined the team!");

      setTournamentDetails((prev) => {
        const updatedTeams = prev.teams.map((team) => {
          if (team.teamCode === teamCode) {
            return {
              ...team,
              members: [...team.members, userId], // Or response.team.members if populated
            };
          }
          return team;
        });

        return {
          ...prev,
          participants: [
            ...(prev?.participants || []),
            { _id: userId }, // Add user to participants
          ],
          teams: updatedTeams,
        };
      });

      setIsModalOpen(false);
      setTeamCode("");
    }
  } catch (err) {
    console.error("Join team failed", err);
    toast.error("Failed to join team");
  }
};



  useEffect(() => {
    const fetchTournament = async () => {
      try {
        console.log("Fetching tournament details for ID:", tournamentId);

        const response = await dispatch(getTournamentById(tournamentId));
        const data = response;

        if (data) {
          setTournamentDetails(data);
          toast.success("Tournament details fetched successfully!");
        } else {
          toast.error("No tournament data found.");
        }
      } catch (error) {
        console.error("Error fetching tournament details:", error);
        toast.error("Failed to fetch tournament details");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [dispatch, tournamentId]);


  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  console.log("Show modal?", showTeamModal);
console.log("User team:", userTeam);


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎮 Tournament Details</h1>

      {loading ? (
        <div className="text-center animate-pulse text-lg">Loading tournament...</div>
      ) : tournamentDetails ? (
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 border border-yellow-700">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">{tournamentDetails.name}</h2>
          <p className="mb-2"><span className="font-bold">Description:</span> {tournamentDetails.description}</p>
          <p className="mb-2"><span className="font-bold">Type:</span> {tournamentDetails.type}</p>
          <p className="mb-2"><span className="font-bold">Format:</span> {tournamentDetails.format}</p>
          <p className="mb-2"><span className="font-bold">Entry Fee:</span> ₹{tournamentDetails.entryFee}</p>
          <p className="mb-2"><span className="font-bold">Game Type:</span> {tournamentDetails.gameType}</p>
          <p className="mb-2"><span className="font-bold">Platform:</span> {tournamentDetails.platform}</p>
          <p className="mb-2"><span className="font-bold">Team Size:</span> {tournamentDetails.teamSize}</p>
          <p className="mb-2"><span className="font-bold">Prize Pool:</span> {tournamentDetails.prizePool}</p>
          <p className="mb-2"><span className="font-bold">Created By:</span> {tournamentDetails.createdBy?.fullName}</p>
          <p className="mb-2"><span className="font-bold">Registration Start:</span> {formatDate(tournamentDetails.registrationStart)}</p>
          <p className="mb-2"><span className="font-bold">Registration End:</span> {formatDate(tournamentDetails.registrationEnd)}</p>
          <p className="mb-2"><span className="font-bold">Check-in Start:</span> {formatDate(tournamentDetails.checkInStart)}</p>
          <p className="mb-2"><span className="font-bold">Check-in End:</span> {formatDate(tournamentDetails.checkInEnd)}</p>
          <p className="mb-2"><span className="font-bold">Match Start Time:</span> {formatDate(tournamentDetails.matchStartTime)}</p>
          <p className="mb-2"><span className="font-bold">Status:</span> <span className="text-green-400">{tournamentDetails.status}</span></p>
        </div>
      ) : (
        <div className="text-center text-red-400 text-lg">Tournament not found.</div>
      )}
{!loading && tournamentDetails && (
  <div className="text-center mt-6">
    {hasUserJoined ? (
      <button
        onClick={() => setShowTeamModal(true)}
        className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white font-semibold transition"
      >
        View Team
      </button>
    ) : (
      <button
        onClick={() => {setIsModalOpen(true)
        console.log("Open modal")}}
        className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded text-white font-semibold transition"
      >
        Join Tournament by Creating a Team
      </button>
    )}
  </div>
)}



{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div className="bg-white text-black rounded-lg p-6 w-[90%] max-w-md shadow-lg">
      <div className="flex justify-between mb-4">
        <button
          className={`w-1/2 py-2 rounded-l ${
            activeTab === "create" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("create")}
        >
          Create Team
        </button>
        <button
          className={`w-1/2 py-2 rounded-r ${
            activeTab === "join" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("join")}
        >
          Join Team
        </button>
      </div>

      {/* CREATE TEAM TAB */}
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

      {/* JOIN TEAM TAB */}
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
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
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


{showTeamModal && userTeam && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white text-black rounded-lg p-6 w-[90%] max-w-md shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-800">Your Team</h2>

      <p><strong>Team Name:</strong> {userTeam.teamName}</p>
      <p><strong>Team Code:</strong> {userTeam.teamCode}</p>
      
      <div className="mt-4">
        <p className="font-semibold mb-1">Members:</p>
        <ul className="list-disc list-inside">
          {userTeam.members.map((member, index) => (
              <li key={index}>
                {typeof member === 'object'
                  ? `${member.fullName} (${member.userName})`
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
