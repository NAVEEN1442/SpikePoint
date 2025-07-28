import React from 'react';
import { ArrowLeft, Calendar, Users, Trophy, DollarSign, Settings, Link2, MapPin, Clock } from 'lucide-react';
const TournamentDetails = ({ tournament, onBack }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
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

  const InfoCard = ({ title, icon: Icon, children }) => (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );


  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900/80 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Tournaments</span>
            </button>
            <div className="h-6 w-px bg-gray-700"></div>
            <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
              {tournament.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tournament Overview */}
        <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-4">{tournament.name}</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {tournament.description || "Join this exciting Valorant tournament and compete against the best players!"}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span className="text-white font-medium">{tournament.gameType}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-white font-medium">{tournament.teamSize || '5v5'}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <Settings className="w-4 h-4 text-green-500" />
                  <span className="text-white font-medium">{tournament.platform || 'PC'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-300">Prize Pool</span>
                </div>
                <p className={`text-2xl font-bold ${getTypeColor(tournament.type)}`}>
                  {tournament.prizePool}
                </p>
                <p className="text-sm text-gray-400">{tournament.type}</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-300">Participants</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {tournament.participants}/{tournament.maxParticipants}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full"
                    style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tournament Information */}
          <InfoCard title="Tournament Information" icon={Trophy}>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Format:</span>
                <span className="text-white font-medium">{tournament.format || 'Knockout'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Game Mode:</span>
                <span className="text-white font-medium">{tournament.gameType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Team Size:</span>
                <span className="text-white font-medium">{tournament.teamSize || '5v5'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="text-white font-medium">{tournament.platform || 'PC'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Type:</span>
                <span className={`font-medium ${getTypeColor(tournament.type)}`}>{tournament.type}</span>
              </div>
            </div>
          </InfoCard>

          {/* Schedule */}
          <InfoCard title="Schedule" icon={Calendar}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-white font-medium">Tournament Date</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(tournament.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <p className="text-gray-400 text-sm mb-2">Registration Status:</p>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Registration Open
                </span>
              </div>
            </div>
          </InfoCard>

          {/* Rules */}
          <InfoCard title="Rules & Regulations" icon={Settings}>
            <div className="text-gray-300 space-y-2">
              {tournament.rules ? (
                <p className="leading-relaxed">{tournament.rules}</p>
              ) : (
                <>
                  <p>• Standard Valorant competitive rules apply</p>
                  <p>• No cheating or exploiting allowed</p>
                  <p>• Respect all participants and organizers</p>
                  <p>• Check-in required 30 minutes before match</p>
                  <p>• Default win awarded after 15 minutes no-show</p>
                </>
              )}
            </div>
          </InfoCard>

          {/* Discord & Contact */}
          <InfoCard title="Communication" icon={Link2}>
            <div className="space-y-4">
              {tournament.discordLink ? (
                <a
                  href={tournament.discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg p-4 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Join Discord Server</p>
                    <p className="text-indigo-400 text-sm">Get updates and communicate with other participants</p>
                  </div>
                </a>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  <p>Discord server will be shared with registered participants</p>
                </div>
              )}
            </div>
          </InfoCard>
        </div>

        {/* Registration Button */}
        <div className="mt-8 text-center">
          <button
            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            disabled={tournament.status === 'completed'}
          >
            {tournament.status === 'completed' ? 'Tournament Completed' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;