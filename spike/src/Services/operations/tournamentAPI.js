// Services/operations/tournamentAPI.js

import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import { endpoint } from "../apis";
import { setTournaments, setLoading, setError } from "../../slices/tournamentSlice";
import { useSelector } from "react-redux";

const {
  CREATE_TOURNAMENT_API,
  GET_ALL_TOURNAMENTS_API,
} = endpoint;

export function createTournament(tournamentData, token, navigate) {
  return async () => {
    const toastId = toast.loading("Creating tournament...");
    
    try {
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await apiConnector("POST", CREATE_TOURNAMENT_API, tournamentData, headers);

      console.log("Create Tournament Response:", response.data.data);

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
