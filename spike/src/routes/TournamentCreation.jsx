import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTournament } from '../Services/operations/tournamentAPI';
import { useNavigate } from 'react-router-dom';

function TournamentCreation() {
  const [formData, setFormData] = useState({
    name: 'My Tournament',
    description: 'Welcome to the best tournament!',
    type: 'free',
    entryFee: '0',
    prizePool: '1000',
    gameType: 'unrated',
    format: 'knockout',
    customFormatDescription: '', // Kept for consistency, but not used
    registrationStart: '2025-08-01T10:00',
    registrationEnd: '2025-08-05T18:00',
    checkInStart: '2025-08-05T18:30',
    checkInEnd: '2025-08-05T19:00',
    matchStartTime: '2025-08-05T19:30',
    teamSize: '1v1',
    maxTeams: '16', // Changed from maxParticipants
    rules: 'Standard tournament rules apply.',
    discordServerLink: 'https://discord.gg/example',
    bannerImage: null, // Will hold the file object
  });

  // Simplified options based on your request
  const types = ['free', 'in-game currency', 'real money'];
  const gameTypes = ['unrated', 'team deathmatch', 'deathmatch', 'spike rush', 'swiftplay'];
  const formats = ['knockout', 'league']; // Simplified formats
  const teamSizes = ['1v1', '2v2', '3v3', '4v4', '5v5'];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Handle file input for banner image
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      return;
    }

    // Handle conditional logic for tournament type and entry fee
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        type: value,
        // Reset entryFee to 0 if type is 'free'
        entryFee: value === 'free' ? '0' : prev.entryFee,
      }));
      return;
    }

    // Default handler for other inputs
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // New handler for combined date and time inputs
  const handleDateTimeChange = (name, part, value) => {
    const currentDateTime = formData[name] || 'T'; // Default to 'T' to prevent split error
    const [currentDate, currentTime] = currentDateTime.split('T');
    
    let newDateTime;
    if (part === 'date') {
        newDateTime = `${value}T${currentTime || '00:00'}`;
    } else { // part === 'time'
        newDateTime = `${currentDate || 'YYYY-MM-DD'}T${value}`;
    }

    setFormData(prev => ({ ...prev, [name]: newDateTime }));
  };


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const createTournamentHandler = (e) => {
    e.preventDefault();

    // NOTE: When submitting a file, you must use FormData
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]);
    });
    
    console.log('Submitting FormData...');
    // Log FormData entries for debugging
    for (let [key, value] of submissionData.entries()) {
        console.log(`${key}:`, value);
    }
    
    // The `createTournament` service must be adapted to handle multipart/form-data
    dispatch(createTournament(submissionData, token, navigate))
      .then((response) => {
        console.log('Tournament created successfully:', response);
      })
      .catch((error) => {
        console.error('Error creating tournament:', error);
      });
  };

  return (
    <div className="min-h-screen  text-white py-10 px-4 md:px-10">
      <h1 className="text-3xl font-bold text-center mb-8">🏆 Create Tournament</h1>

      <form
        onSubmit={createTournamentHandler}
        className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Basic Info */}
        <div>
          <label className="block mb-1 font-semibold">Tournament Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white" rows="3" />
        </div>

        {/* Entry and Prize */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white">
              {types.map((type) => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>
          
          {/* 3 & 4. Conditional Entry Fee */}
          {formData.type !== 'free' && (
            <div>
              <label className="block mb-1 font-semibold">Entry Fee</label>
              <input
                type="number"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                placeholder="Enter fee"
                min="1"
                step="1"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold">Prize Pool</label>
            <input name="prizePool" value={formData.prizePool} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white" />
          </div>
        </div>

        {/* Game Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Game Type</label>
            <select name="gameType" value={formData.gameType} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white">
              {gameTypes.map((game) => (<option key={game} value={game}>{game}</option>))}
            </select>
          </div>
          <div>
            {/* 6. Simplified Format */}
            <label className="block mb-1 font-semibold">Format</label>
            <select name="format" value={formData.format} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white">
              {formats.map((format) => (<option key={format} value={format}>{format}</option>))}
            </select>
          </div>
        </div>
        
        {/* 7. Improved Calendar System */}
        <h2 className="text-xl font-semibold border-t border-gray-700 pt-4 mt-4">Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          {[
            { label: "Registration Start", name: "registrationStart" },
            { label: "Registration End", name: "registrationEnd" },
            { label: "Check-in Start", name: "checkInStart" },
            { label: "Check-in End", name: "checkInEnd" },
            { label: "Match Start Time", name: "matchStartTime" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-semibold">{label}</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  onChange={(e) => handleDateTimeChange(name, 'date', e.target.value)}
                  value={(formData[name] || 'T').split('T')[0]}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
                <input
                  type="time"
                  onChange={(e) => handleDateTimeChange(name, 'time', e.target.value)}
                  value={(formData[name] || 'T').split('T')[1]}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Participant Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Team Size</label>
            <select name="teamSize" value={formData.teamSize} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white">
              {teamSizes.map((size) => (<option key={size} value={size}>{size}</option>))}
            </select>
          </div>
          <div>
            {/* 8. Max Participants -> Max Teams */}
            <label className="block mb-1 font-semibold">Max Teams</label>
            <input type="number" name="maxTeams" value={formData.maxTeams} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white" min="2" />
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <label className="block mb-1 font-semibold">Rules</label>
          <textarea name="rules" value={formData.rules} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white" rows="3" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Discord Server Link</label>
          <input name="discordServerLink" value={formData.discordServerLink} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white" />
        </div>
        
        {/* 1. Banner Image File Input */}
        <div>
            <label className="block mb-1 font-semibold">Banner Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-400">
                    <label htmlFor="bannerImage" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500 px-2">
                    <span>Upload a file</span>
                    <input id="bannerImage" required name="bannerImage" type="file" className="sr-only" onChange={handleChange} accept="image/*"/>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                {formData.bannerImage ? (
                  <p className="text-xs text-gray-300">{formData.bannerImage.name}</p>
                ) : (
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                )}
                </div>
            </div>
        </div>

        <div className="text-center pt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200">
            Create Tournament
          </button>
        </div>
      </form>
    </div>
  );
}

export default TournamentCreation;