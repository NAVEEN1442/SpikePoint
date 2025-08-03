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
    <div className=' bg-[white] ' >
      <h1>Create Tournament</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Tournament Name" />

        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />

        <select name="type" value={formData.type} onChange={handleChange}>
          {types.map(type => <option key={type} value={type}>{type}</option>)}
        </select>

        <input name="entryFee" value={formData.entryFee} onChange={handleChange} placeholder="Entry Fee" />

        <select name="currencyType" value={formData.currencyType} onChange={handleChange}>
          {currencyTypes.map(currency => <option key={currency} value={currency}>{currency}</option>)}
        </select>

        <input name="prizePool" value={formData.prizePool} onChange={handleChange} placeholder="Prize Pool" />

        <select name="gameType" value={formData.gameType} onChange={handleChange}>
          {gameTypes.map(game => <option key={game} value={game}>{game}</option>)}
        </select>

        <select name="format" value={formData.format} onChange={handleChange}>
          {formats.map(format => <option key={format} value={format}>{format}</option>)}
        </select>

        {formData.format === 'custom' && (
          <textarea
            name="customFormatDescription"
            value={formData.customFormatDescription}
            onChange={handleChange}
            placeholder="Custom Format Description"
          />
        )}

        <label>Registration Start</label>
        <input type="datetime-local" name="registrationStart" value={formData.registrationStart} onChange={handleChange} />

        <label>Registration End</label>
        <input type="datetime-local" name="registrationEnd" value={formData.registrationEnd} onChange={handleChange} />

        <label>Check-in Start</label>
        <input type="datetime-local" name="checkInStart" value={formData.checkInStart} onChange={handleChange} />

        <label>Check-in End</label>
        <input type="datetime-local" name="checkInEnd" value={formData.checkInEnd} onChange={handleChange} />

        <label>Match Start Time</label>
        <input type="datetime-local" name="matchStartTime" value={formData.matchStartTime} onChange={handleChange} />

        <select name="teamSize" value={formData.teamSize} onChange={handleChange}>
          {teamSizes.map(size => <option key={size} value={size}>{size}</option>)}
        </select>

        <input name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} placeholder="Max Participants" />

        <textarea name="rules" value={formData.rules} onChange={handleChange} placeholder="Rules" />

        <select name="platform" value={formData.platform} onChange={handleChange}>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <input name="discordServerLink" value={formData.discordServerLink} onChange={handleChange} placeholder="Discord Server Link" />

        <input name="bannerImage" value={formData.bannerImage} onChange={handleChange} placeholder="Banner Image URL" />

        <button onClick={createTournamentHandler} type="submit">Create Tournament</button>
      </form>
    </div>
  );
}

export default TournamentCreation;
