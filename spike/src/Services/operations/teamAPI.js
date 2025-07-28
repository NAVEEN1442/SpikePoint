// services/teamService.js

import { useSelector } from 'react-redux';
import { setTeam, setTeamError, setTeamLoading } from '../../slices/teamSlice';
import { apiConnector } from '../apiConnector';
import { teamEndpoints } from '../apis';

const { CREATE_TEAM_API, JOIN_TEAM_API } = teamEndpoints;

export const createTeam = (tournamentId,token, navigate) => async (dispatch) => {
  try {
    dispatch(setTeamLoading(true));
    console.log("Creating team for tournament ID:", tournamentId);
    
    

    const headers = {
        
        Authorization: `Bearer ${token}`,
      };
    

    const response = await apiConnector("POST", CREATE_TEAM_API,  {tournamentId}, headers );
    console.log("Team created successfully:", response.data);
   

    dispatch(setTeam(response.data?.team));
    // navigate(`/team/${response.data?.team?._id}`);
  } catch (error) {
  console.error("Create Team Error:", error.response?.data || error.message);

  dispatch(
    setTeamError(
      error.response?.data?.message || "Failed to create team"
    )
  );
}
 finally {
    dispatch(setTeamLoading(false));
  }
};

export const joinTeam = (teamCode, navigate) => async (dispatch) => {
  try {
    dispatch(setTeamLoading(true));

    const response = await apiConnector("POST", JOIN_TEAM_API, { teamCode });

    dispatch(setTeam(response.data?.team));
    navigate(`/team/${response.data?.team?._id}`);
  } catch (error) {
    dispatch(
      setTeamError(
        error.response?.data?.message || "Invalid code or join failed"
      )
    );
  } finally {
    dispatch(setTeamLoading(false));
  }
};
