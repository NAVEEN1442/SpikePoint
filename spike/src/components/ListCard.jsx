// src/components/ListCard.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { format, isBefore, isAfter } from "date-fns";
import { deleteTheTournament } from "@/Services/operations/tournamentAPI";
import { Gamepad2, Swords, Calendar, Users, Award, Trash2 } from "lucide-react";

// Helper function to format dates nicely
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
        return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
        return "Invalid Date";
    }
};

// Helper function to determine the tournament status
const getTournamentStatus = (tournament) => {
    const now = new Date();
    const regStart = new Date(tournament.registrationStart);
    const regEnd = new Date(tournament.registrationEnd);
    const matchStart = new Date(tournament.matchStartTime);

    if (isBefore(now, regStart)) return { text: "Upcoming", color: "bg-cyan-500" };
    if (isAfter(now, regStart) && isBefore(now, regEnd)) return { text: "Registration Open", color: "bg-green-500" };
    if (isAfter(now, regEnd) && isBefore(now, matchStart)) return { text: "Registration Closed", color: "bg-yellow-500" };
    if (isAfter(now, matchStart)) return { text: "Live / Concluded", color: "bg-red-500" };
    return { text: "Scheduled", color: "bg-gray-500" };
};

function TournamentCard({ tournament }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = getTournamentStatus(tournament);
    
    // The delete action is now self-contained in the card
    const handleDelete = (e) => {
        e.preventDefault(); // Prevent navigation if card is wrapped in a link
        e.stopPropagation();
        
            dispatch(deleteTheTournament(tournament._id, navigate));
        
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:border-indigo-500 hover:shadow-indigo-500/20 hover:-translate-y-1">
            {/* Banner Image */}
            <div className="relative">
                <img
                    src={tournament.bannerImage.url || 'https://via.placeholder.com/400x200?text=No+Banner'}
                    alt={`${tournament.name} Banner`}
                    className="w-full h-40 object-cover"
                />
                <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white ${status.color}`}>
                    {status.text}
                </div>
            </div>

            <div className="p-5">
                {/* Title & Description */}
                <h2 className="text-xl font-bold text-white truncate">{tournament.name}</h2>
                <p className="text-gray-400 text-sm mt-1 h-10 overflow-hidden text-ellipsis">{tournament.description}</p>
                
                {/* Core Info Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-sm">
                    <InfoItem icon={Award} label="Prize Pool" value={tournament.prizePool} />
                    <InfoItem icon={Gamepad2} label="Game" value={tournament.gameType} />
                    <InfoItem icon={Users} label="Max Teams" value={tournament.maxTeams} />
                    <InfoItem icon={Swords} label="Format" value={tournament.format} />
                </div>

                {/* Registration Info */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <InfoItem icon={Calendar} label="Registration Ends" value={formatDate(tournament.registrationEnd)} />
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-5">
                    <Link to={`/tournament-details/${tournament._id}`}>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                            View Details
                        </button>
                    </Link>
                    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-component for consistent info display
const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-gray-300">
        <Icon className="text-gray-500" size={16} />
        <span className="capitalize">{value || "N/A"}</span>
    </div>
);

export default TournamentCard;