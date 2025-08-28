// Services/operations/tournamentAPI.js
import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import { endpoint } from "../apis";
import { setTournaments, setLoading, setError, deleteTournament } from "../../slices/tournamentSlice";
import { useSelector } from "react-redux";
import { teamEndpoints } from "../apis";
import { socket } from "../../socket"; // ✅ import socket

const {
  CREATE_TOURNAMENT_API,
  GET_ALL_TOURNAMENTS_API,
  GET_TOURNAMENT_BY_ID,
  DELETE_TOURNAMENT_API
} = endpoint;

const { CREATE_TEAM_API } = teamEndpoints;

// tournamentAPI.js
export const deleteTheTournament = (tournamentId, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("DELETE", DELETE_TOURNAMENT_API.replace(":id", tournamentId));

      if (response.data.success) {
        toast.success("Tournament deleted successfully!");
        // ✅ Do NOT emit socket event here, let server handle it
        navigate("/tournament-list");
      } else {
        throw new Error(response.data.message || "Failed to delete tournament");
      }

      return response;
    } catch (error) {
      console.error("[TournamentAPI] Delete Tournament Error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete tournament");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// Create Tournament
export function createTournament(tournamentData, token, navigate) {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Creating tournament...");

    try {

      const headers = {
        Authorization: `Bearer ${token}`,
      };
        

      const response = await apiConnector(
        "POST",
        CREATE_TOURNAMENT_API,
        tournamentData,
        headers
      );

      console.log("Submission Data:");

      for (let [key, value] of tournamentData.entries()) {
          console.log("Key:", key, "Value:", value);
        }


      if (!response.data?.success) {
        throw new Error(response.data?.message || "Tournament creation failed");
      }

      console.log("[TournamentAPI] Tournament created:", response.data.data);

      toast.success("Tournament created successfully!");
      navigate("/tournament-list");

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("[TournamentAPI] Create Tournament Error:", error);

      toast.error(error.response?.data?.message || error.message || "Failed to create tournament");

      return {
        success: false,
        error: error.response?.data || error.message,
      };
    } finally {
      toast.dismiss(toastId);
    }
  };
}



// Get all tournaments
export const getAllTournaments = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ALL_TOURNAMENTS_API);

      console.log("[TournamentAPI] Fetched tournaments:", response.data.data);
      dispatch(setTournaments(response.data.data));

      return response;
    } catch (error) {
      console.error("[TournamentAPI] Fetch tournaments error:", error);
      dispatch(setError("Failed to load tournaments"));
      toast.error("Error loading tournaments");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// Get Tournament by ID
export const getTournamentById = (tournamentId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_TOURNAMENT_BY_ID.replace(":id", tournamentId));
      console.log("[TournamentAPI] Fetched Tournament by ID:", response?.data?.data);
      return response?.data?.data;
    } catch (error) {
      console.error("[TournamentAPI] Get Tournament by ID Error:", error);
      dispatch(setError("Failed to load tournament"));
      toast.error("Error loading tournament");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};




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

//new updatetournamentstatus function

// ✅ Update Tournament Status
export const updateTournamentStatus = (tournamentId, status) => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const token = getState().auth.token;

      const response = await apiConnector(
        "PUT",
        `/tournament/${tournamentId}/status`,
        { status },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response?.data?.success) {
        toast.success("Tournament status updated!");
        return response.data;
      } else {
        throw new Error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("[TournamentAPI] Update Status Error:", error);
      toast.error(error.response?.data?.message || error.message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
