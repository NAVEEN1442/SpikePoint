// src/components/TournamentCardSkeleton.js

import React from "react";

function TournamentCardSkeleton() {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
            <div className="w-full h-40 bg-gray-700 animate-pulse" />
            <div className="p-5">
                <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse mb-3" />
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-1" />
                <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-5 w-full bg-gray-700 rounded animate-pulse" />
                    <div className="h-5 w-full bg-gray-700 rounded animate-pulse" />
                    <div className="h-5 w-full bg-gray-700 rounded animate-pulse" />
                    <div className="h-5 w-full bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="h-9 w-28 bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default TournamentCardSkeleton;