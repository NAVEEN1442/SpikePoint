import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getAllTournaments } from '../Services/operations/tournamentAPI';
import { useNavigate } from 'react-router-dom';


function TournamentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tournamentData, setTournamentData] = useState([]);
 

  const token = useSelector((state) => state.auth.token);

  // Initial fetch of tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await dispatch(getAllTournaments());
        console.log("response", response?.data?.data);
        setTournamentData(response?.data?.data);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      }
    };

    fetchTournaments();
  }, [dispatch]);



  return (
    <div className="text-white"> 
      <div className="flex items-center justify-between mb-4">
        <h1>Tournament List</h1>
        <div className="flex items-center gap-4">
          {/* Connection status indicator */}
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{isConnected ? 'Online' : 'Offline'}</span>
          
          <Link to="/create-tournament">
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
              Create Tournament
            </button>
          </Link>
        </div>
      </div>

      <div className="p-2 flex flex-col items-center justify-center">  
        {tournamentData.length > 0 ? (
          <div className="w-full space-y-4">
            {tournamentData.map(tournament => (
              <div 
                className="border-2 border-yellow-900 p-4 rounded-lg hover:border-yellow-700 transition-colors" 
                key={tournament._id}
              >
                <div className="flex flex-wrap gap-5 items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{tournament.name}</h2>
                    <p className="text-gray-300">{tournament.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <p>Type: <span className="text-yellow-400">{tournament.type}</span></p>
                      <p>Entry Fee: <span className="text-green-400">{tournament.entryFee}</span></p>
                      <p>Game Type: <span className="text-blue-400">{tournament.gameType}</span></p>
                      {tournament.status && (
                        <p>Status: <span className="text-purple-400">{tournament.status}</span></p>
                      )}
                    </div>
                  </div>
                  
                  <Link to={`/tournament-details/${tournament._id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No tournaments available</p>
            <p className="text-gray-500 text-sm mt-2">Create the first tournament to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TournamentList