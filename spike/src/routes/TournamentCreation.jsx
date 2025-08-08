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
    currencyType: 'INR',
    prizePool: '1000',
    gameType: 'unrated',
    format: 'knockout',
    customFormatDescription: '',
    registrationStart: '2025-08-01T10:00',
    registrationEnd: '2025-08-05T18:00',
    checkInStart: '2025-08-05T18:30',
    checkInEnd: '2025-08-05T19:00',
    matchStartTime: '2025-08-05T19:30',
    teamSize: '1v1',
    maxParticipants: '16',
    rules: 'Standard tournament rules apply.',
    platform: 'PC',
    discordServerLink: 'https://discord.gg/example',
    bannerImage: '',
  });

  const types = ['free', 'in-game currency', 'real money'];
  const currencyTypes = ['INR', 'USD', 'coins', 'tokens'];
  const gameTypes = ['unrated', 'team deathmatch', 'deathmatch', 'spike rush', 'swiftplay'];
  const formats = ['knockout', 'league', 'custom'];
  const teamSizes = ['1v1', '2v2', '3v3', '4v4', '5v5'];
  const platforms = ['PC', 'Mobile', 'Console', 'Cross-platform'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

const createTournamentHandler = (e) => {
  e.preventDefault(); // Move this to the top to prevent page reload first

  dispatch(createTournament(formData, token, navigate))
    .then((response) => {
      console.log('Tournament created successfully:', response?.data?.data);
    })
    .catch((error) => {
      console.error('Error creating tournament:', error);
    });
};


  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 md:px-10">
  <h1 className="text-3xl font-bold text-center mb-8">🏆 Create Tournament</h1>

  <form
    onSubmit={handleSubmit}
    className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg space-y-6"
  >
    {/* Tournament Name */}
    <div>
      <label className="block mb-1 font-semibold">Tournament Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        placeholder="Enter tournament name"
        required
      />
    </div>

    {/* Description */}
    <div>
      <label className="block mb-1 font-semibold">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        placeholder="Enter description"
        rows="3"
      />
    </div>

    {/* Dropdowns */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-semibold">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        >
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Entry Fee (₹)</label>
        <input
          name="entryFee"
          value={formData.entryFee}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Currency Type</label>
        <select
          name="currencyType"
          value={formData.currencyType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        >
          {currencyTypes.map((currency) => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Prize Pool</label>
        <input
          name="prizePool"
          value={formData.prizePool}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          placeholder="To Be Announced"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Game Type</label>
        <select
          name="gameType"
          value={formData.gameType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        >
          {gameTypes.map((game) => (
            <option key={game} value={game}>{game}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Format</label>
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        >
          {formats.map((format) => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Custom Format */}
    {formData.format === 'custom' && (
      <div>
        <label className="block mb-1 font-semibold">Custom Format Description</label>
        <textarea
          name="customFormatDescription"
          value={formData.customFormatDescription}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          placeholder="Enter custom format description"
        />
      </div>
    )}

    {/* Date & Time Pickers */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { label: "Registration Start", name: "registrationStart" },
        { label: "Registration End", name: "registrationEnd" },
        { label: "Check-in Start", name: "checkInStart" },
        { label: "Check-in End", name: "checkInEnd" },
        { label: "Match Start Time", name: "matchStartTime" },
      ].map(({ label, name }) => (
        <div key={name}>
          <label className="block mb-1 font-semibold">{label}</label>
          <input
            type="datetime-local"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />
        </div>
      ))}
    </div>

    {/* Team Size & Participants */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-semibold">Team Size</label>
        <select
          name="teamSize"
          value={formData.teamSize}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        >
          {teamSizes.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Max Participants</label>
        <input
          name="maxParticipants"
          value={formData.maxParticipants}
          onChange={handleChange}
          type="number"
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        />
      </div>
    </div>

    {/* Rules */}
    <div>
      <label className="block mb-1 font-semibold">Rules</label>
      <textarea
        name="rules"
        value={formData.rules}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        placeholder="Write the rules here"
        rows="3"
      />
    </div>

    {/* Platform, Discord, Image */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-semibold">Platform</label>
        <select
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        >
          {platforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Discord Server Link</label>
        <input
          name="discordServerLink"
          value={formData.discordServerLink}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          placeholder="https://discord.gg/..."
        />
      </div>

      <div className="md:col-span-2">
        <label className="block mb-1 font-semibold">Banner Image URL</label>
        <input
          name="bannerImage"
          value={formData.bannerImage}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          placeholder="https://example.com/banner.jpg"
        />
      </div>
    </div>

    {/* Submit Button */}
    <div className="text-center">
      <button
        onClick={createTournamentHandler}
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition duration-200"
      >
        Create Tournament
      </button>
    </div>
  </form>
</div>

  );
}

export default TournamentCreation;
