// Services/operations/tournamentAPI.js
import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import { endpoint } from "../apis";
import { setTournaments, setLoading, setError } from "../../slices/tournamentSlice";
import { useSelector } from "react-redux";
import { teamEndpoints } from "../apis";

const {
  CREATE_TOURNAMENT_API,
  GET_ALL_TOURNAMENTS_API,
  GET_TOURNAMENT_BY_ID,
} = endpoint;

const { CREATE_TEAM_API } = teamEndpoints;

export function createTournament(tournamentData, token, navigate) {
  return async () => {
    const toastId = toast.loading("Creating tournament...");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await apiConnector("POST", CREATE_TOURNAMENT_API, tournamentData, headers);

      if (!response.data.success) {
        throw new Error(response.data.message || "Tournament creation failed");
      }

  

      toast.success("Tournament created successfully!");
      navigate("/tournament-list");
      return response;
    } catch (error) {
      console.error("Create Tournament Error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to create tournament");
    } finally {
      toast.dismiss(toastId);
    }
  };
}


export const getAllTournaments = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ALL_TOURNAMENTS_API);
      dispatch(setTournaments(response.data.data));
      return response; // ✅ This allows useEffect to receive it
    } catch (error) {
      dispatch(setError("Failed to load tournaments"));
      toast.error("Error loading tournaments");
      throw error; // ✅ Re-throw so you can catch it in useEffect
    } finally {
      dispatch(setLoading(false));
    }
  };
};


export const getTournamentById = (tournamentId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET",GET_TOURNAMENT_BY_ID.replace(":id", tournamentId));
      console.log("Fetched Tournament:", response?.data?.data);
      return response?.data?.data; // ✅ Return the tournament data
    } catch (error) {
      dispatch(setError("Failed to load tournament"));
      toast.error("Error loading tournament");
      throw error; // ✅ Re-throw so you can catch it in useEffect
    } finally {
      dispatch(setLoading(false));
    }
  };
}


export const createTeamForTournament = ({ tournamentId, teamName }) => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const token = getState().auth.token;
      const response = await apiConnector(
        "POST",
        CREATE_TEAM_API,
        { tournamentId, teamName },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response?.data?.success) {
        toast.success("Team created and joined tournament!");
        return response.data;
      } else {
        toast.error(response?.data?.message || "Failed to create team");
      }
    } catch (error) {
      toast.error("Error creating team");
      console.error("Create Team Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};