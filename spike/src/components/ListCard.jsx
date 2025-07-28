import React, { useState } from 'react';
import { FaUsers, FaTrophy } from 'react-icons/fa';
import { BsCalendarEvent } from 'react-icons/bs';
import { GiMoneyStack } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { createTeam, joinTeam } from '../Services/operations/teamAPI';
import { useNavigate } from 'react-router-dom';

function TournamentCard({ tournaments }) {
  const [showModal, setShowModal] = useState(null);
  const [createdTeam, setCreatedTeam] = useState(null);
  const [teamDetailsModalOpen, setTeamDetailsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'free':
        return 'bg-green-900 text-green-300 border-green-700';
      case 'in-game currency':
        return 'bg-blue-900 text-blue-300 border-blue-700';
      case 'real money':
        return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (tournament) => {
    const now = new Date();
    const startTime = new Date(tournament.matchStartTime);
    const registrationEnd = new Date(tournament.registrationEndTime || tournament.matchStartTime);

    if (now < registrationEnd) {
      return {
        status: 'open',
        color: 'bg-green-100 text-green-700 border-green-300',
        text: 'Registration Open',
      };
    } else if (now < startTime) {
      return {
        status: 'upcoming',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        text: 'Upcoming',
      };
    } else {
      return {
        status: 'live',
        color: 'bg-red-100 text-red-700 border-red-300',
        text: 'Live',
      };
    }
  };

  const handleCreateTeam = async () => {
    try {
      const result = await dispatch(createTeam(tournaments._id, token, navigate));
      if (result?.payload) {
        setCreatedTeam(result.payload);
        setTeamDetailsModalOpen(true);
        setShowModal(null);
      }
    } catch (error) {
      console.error('Failed to create team', error);
    }
  };

  const handleJoinTeam = () => {
    setShowModal('join');
  };

  const handleJoinTeamFromModal = (code) => {
    if (code.trim()) {
      dispatch(joinTeam(code.trim(), navigate));
      setShowModal(null);
    }
  };

  const statusInfo = getStatusInfo(tournaments);

  return (
    <>
      <div className="w-full sm:w-1/2 md:w-[45%] lg:w-[30%] bg-[#1a1a1a]/60 backdrop-blur-md shadow-xl rounded-xl border border-[#333] transition-all hover:shadow-2xl hover:scale-[1.02] duration-300 m-2">
        <div className="p-4 border-b border-[#2c2c2c]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-white">{tournaments.name}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{tournaments.description}</p>
            </div>
            <FaTrophy className="text-[#ff4655] text-lg mt-2 sm:mt-1" />
          </div>
        </div>

        <div className="px-4 py-3 border-b border-[#2c2c2c]">
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(tournaments.type)}`}>
              {tournaments.type}
            </span>
            <span className="bg-[#2a2a2a] text-gray-300 px-2 py-1 rounded text-xs font-medium border border-[#444]">
              {tournaments.gameType}
            </span>
            <span className="bg-[#2a2a2a] text-purple-400 px-2 py-1 rounded text-xs font-medium border border-purple-600">
              {tournaments.format}
            </span>
          </div>
        </div>

        <div className="p-4 text-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <GiMoneyStack className="text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Entry</p>
                <p className="font-semibold">{tournaments.type === 'free' ? 'Free' : `₹${tournaments.entryFee}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BsCalendarEvent className="text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Start</p>
                <p className="font-semibold">{formatDateTime(tournaments.matchStartTime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaUsers className="text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Team</p>
                <p className="font-semibold">{tournaments.teamSize} Players</p>
              </div>
            </div>
          </div>
        </div>

        {statusInfo.status === 'open' && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setShowModal('main')}
              className="w-full font-medium py-2 px-4 rounded bg-[#ff4655] text-white hover:bg-[#e73e4b] transition"
            >
              Register Here
            </button>
          </div>
        )}
      </div>

      {/* Modal components can stay the same as your previous code, they are already responsive */}
    </>
  );
}

export default TournamentCard;
