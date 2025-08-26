// src/pages/TournamentList.js

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { Search, X, PlusCircle, ServerCrash } from "lucide-react";

import { getAllTournaments } from "../Services/operations/tournamentAPI";
import { setTournaments, addTournament, setConnected, deleteTournament } from "../slices/tournamentSlice";
import TournamentCard from "@/components/ListCard"; // Assuming correct path
import TournamentCardSkeleton from "@/components/TournamentCardSkeleton"; // New skeleton component

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

function TournamentList() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [gameFilter, setGameFilter] = useState("all");

    // Get all state directly from Redux store
    const { tournaments, connected } = useSelector((state) => state.tournament);
    const { token, user } = useSelector((state) => state.auth);

    // Initial data fetch and socket connection setup
    useEffect(() => {
        const fetchAndInitSockets = async () => {
            try {
                setLoading(true);
                const response = await dispatch(getAllTournaments());
                dispatch(setTournaments(response?.data?.data || []));
            } catch (err) {
                console.error("[TournamentList] Fetch error:", err);
                setError("Could not load tournaments. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAndInitSockets();

        const socket = io(SOCKET_URL, { transports: ["websocket"], query: { token } });

        socket.on("connect", () => dispatch(setConnected(true)));
        socket.on("disconnect", () => dispatch(setConnected(false)));
        socket.on("tournament_created", (newTournament) => dispatch(addTournament(newTournament)));
        socket.on("tournament_deleted", (payload) => dispatch(deleteTournament(payload.id || payload._id)));

        return () => socket.disconnect();
    }, [dispatch, token]);
    
    // Memoize filtering logic for performance
    const filteredTournaments = useMemo(() => {
        return tournaments.filter((t) => {
            const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = gameFilter === 'all' || t.gameType === gameFilter;
            return matchesSearch && matchesFilter;
        });
    }, [tournaments, searchTerm, gameFilter]);
    
    const uniqueGameTypes = useMemo(() => ['all', ...new Set(tournaments.map(t => t.gameType))], [tournaments]);



    return (
        <div className="min-h-screen text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold">Tournaments</h1>
                        <p className="text-gray-400">Find and join the next big competition.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold">{user?.userName || "Guest"}</span>
                            <div className={`w-3 h-3 rounded-full transition-colors ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} title={connected ? "Real-time updates active" : "Disconnected"} />
                        </div>
                        <Link to="/create-tournament">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                                <PlusCircle size={20} /> Create
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Filter and Search Section */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by tournament name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {searchTerm && <X className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => setSearchTerm("")} />}
                    </div>
                    <select
                        value={gameFilter}
                        onChange={(e) => setGameFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {uniqueGameTypes.map(game => <option key={game} value={game}>{game.charAt(0).toUpperCase() + game.slice(1)}</option>)}
                    </select>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <TournamentCardSkeleton key={i} />)}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-gray-800 rounded-lg">
                        <ServerCrash className="mx-auto text-red-500 mb-4" size={50} />
                        <h3 className="text-xl font-semibold text-red-400">An Error Occurred</h3>
                        <p className="text-gray-400">{error}</p>
                    </div>
                ) : filteredTournaments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredTournaments.map((tournament) => (
                            <TournamentCard key={tournament._id} tournament={tournament} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-semibold">No Tournaments Found</h3>
                        <p className="text-gray-400 mt-2">
                            No tournaments match your criteria. Try adjusting your search or create a new one!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TournamentList;