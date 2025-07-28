import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const leaderboardData = [
  { name: 'PlayerOne', points: 1200 },
  { name: 'AceMaster', points: 1100 },
  { name: 'SpikeKing', points: 950 },
  { name: 'ValorChamp', points: 900 },
  { name: 'BuddyFinder', points: 850 },
];

const Leadershipboard = () => {
  return (
    <div className='relative flex flex-col gap-6 items-center overflow-auto hide-scrollbar w-full min-h-screen text-white'>
      <div className="inset-0 absolute bg-grid-white/[0.06] pointer-events-none z-0" />
      <Navbar />
      <h1 className='text-4xl md:text-5xl font-bold text-center z-10 mt-8 text-white'>
        Leadershipboard
      </h1>
      <div className='w-full px-4 md:px-12 z-10'>
        <div className='h-[60px] w-full flex flex-wrap justify-between items-center gap-4'>
          <div className='text-[22px] text-white flex gap-2 items-center'>
            Top Players
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 w-full px-6">
        {leaderboardData.map((player, idx) => (
          <div key={player.name} className="bg-[#1A1A1A] border border-white/20 rounded-xl shadow-md p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-400">#{idx + 1}</span>
            <span className="text-xl font-semibold mt-2 text-white">{player.name}</span>
            <span className="text-lg mt-1 text-gray-300">Points: {player.points}</span>
          </div>
        ))}
      </div>
      <div className="h-16 z-0" />
      <Footer />
    </div>
  );
};

export default Leadershipboard;
