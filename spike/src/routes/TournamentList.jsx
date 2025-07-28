import React from 'react';
import { Plus, Calendar, Users, Trophy, MapPin } from 'lucide-react';

const TournamentList = ({ onCreateTournament, onViewTournament }) => {
  // Sample tournament data
  const tournaments = [
    {
      id: '1',
      name: 'Valorant Champions Cup',
      type: 'Real Money',
      prizePool: '₹50,000',
      participants: 64,
      maxParticipants: 128,
      status: 'upcoming',
      date: '2025-02-15',
      gameType: 'Unrated'
    },
    {
      id: '2',
      name: 'Weekly Deathmatch Arena',
      type: 'Free',
      prizePool: 'Glory',
      participants: 32,
      maxParticipants: 64,
      status: 'live',
      date: '2025-01-20',
      gameType: 'Deathmatch'
    },
    {
      id: '3',
      name: 'Spike Rush Lightning',
      type: 'In-game Currency',
      prizePool: '10,000 VP',
      participants: 16,
      maxParticipants: 32,
      status: 'completed',
      date: '2025-01-10',
      gameType: 'Spike Rush'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'real money': return 'text-yellow-400';
      case 'in-game currency': return 'text-purple-400';
      case 'free': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };


  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Tournaments</h1>
              <p className="text-gray-400">Compete in exciting Valorant tournaments</p>
            </div>
            <button
              onClick={onCreateTournament}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            >
              <Plus className="w-5 h-5" />
              Create Tournament
            </button>
          </div>
        </div>
      </div>

      {/* Tournament Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              onClick={() => onViewTournament(tournament)}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-red-500/50 hover:bg-gray-900/70 transition-all duration-200 cursor-pointer group"
            >
              {/* Tournament Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors duration-200">
                  {tournament.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tournament.status)}`}>
                  {tournament.status.toUpperCase()}
                </span>
              </div>

              {/* Tournament Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Prize Pool:</span>
                  <span className={`font-medium ${getTypeColor(tournament.type)}`}>
                    {tournament.prizePool}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Participants:</span>
                  <span className="font-medium text-white">
                    {tournament.participants}/{tournament.maxParticipants}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Date:</span>
                  <span className="font-medium text-white">
                    {new Date(tournament.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Game Mode:</span>
                  <span className="font-medium text-white">
                    {tournament.gameType}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Registration Progress</span>
                  <span>{Math.round((tournament.participants / tournament.maxParticipants) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Tournament Type Badge */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(tournament.type)} bg-gray-800/50`}>
                  {tournament.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No Tournaments Available</h3>
            <p className="text-gray-500 mb-6">Create your first tournament to get started</p>
            <button
              onClick={onCreateTournament}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Create Tournament
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentList;