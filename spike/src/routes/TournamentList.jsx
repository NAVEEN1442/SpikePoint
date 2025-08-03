import React, { use } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getAllTournaments } from '../Services/operations/tournamentAPI';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function TournamentList() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tournamentData,setTournamentData] = useState([]);

  const token = useSelector((state) => state.auth.token);

  // Fetch tournaments logic can be added here
useEffect(() => {
  const fetchTournaments = async () => {
    try {
      const response = await dispatch(getAllTournaments());
      console.log("response", response);
      setTournamentData(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
    }
  };

  fetchTournaments();
}, []);


  return (
    <div className=" text-white "> 
      <h1>Tournament List</h1>
      <Link to="/create-tournament">
        <button className=' bg-[red] ' >Create Tournament</button>
      </Link>
      <div className=' p-2 flex flex-col items-center  justify-center ' >  
        {
        tournamentData.length > 0 ? (
          <div>
            {tournamentData.map(tournament => (
              <div className=' border-2 flex gap-5 border-yellow-900 ' key={tournament._id}>
                <h2>{tournament.name}</h2>
                <p>{tournament.description}</p>
                <p>Type: {tournament.type}</p>
                <p>Entry Fee: {tournament.entryFee}</p>
                <p>Game Type: {tournament.gameType}</p>
                <Link to={`/tournament-details`}>
                  <button className=' bg-[blue] '>View Details</button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No tournaments available</p>
        )
      }
      </div>
    </div>
  )
}

export default TournamentList
