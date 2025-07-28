import React, { useState } from 'react';
import { ArrowLeft, Upload, Calendar, Users, Trophy, DollarSign, Settings, Link } from 'lucide-react';

const TournamentCreate = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'free',
    entryFee: '',
    currencyType: 'INR',
    prizePool: '',
    gameType: 'unrated',
    format: 'knockout',
    customFormatDescription: '',
    registrationStart: '',
    registrationEnd: '',
    checkInStart: '',
    checkInEnd: '',
    matchStartTime: '',
    teamSize: '1v1',
    maxParticipants: '',
    rules: '',
    platform: 'PC',
    discordServerLink: '',
    bannerImage: '',
  });

  const types = ['free', 'in-game currency', 'real money'];
  const currencyTypes = ['INR', 'USD', 'coins', 'tokens'];
  const gameTypes = ['unrated', 'team deathmatch', 'deathmatch', 'spike rush', 'swiftplay'];
  const formats = ['knockout', 'league', 'custom'];
  const teamSizes = ['1v1', '2v2', '3v3', '4v4', '5v5'];
  const platforms = ['PC', 'Mobile', 'Console', 'Cross-platform'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const FormSection = ({ title, icon: Icon, children }) => (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-5 h-5 text-red-500" />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );

  const InputField = ({ label, name, type = 'text', placeholder, required = false, className = '' }) => (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className="bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );

  const SelectField = ({ label, name, options, required = false, className = '' }) => (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required={required}
        className="bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
      >
        {options.map(option => (
          <option key={option} value={option} className="bg-gray-800">
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  const TextAreaField = ({ label, name, placeholder, required = false, rows = 4, className = '' }) => (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gray-900/80 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-gray-700"></div>
            <h1 className="text-2xl font-bold text-white">Create Tournament</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <FormSection title="Basic Information" icon={Trophy}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputField label="Tournament Name" name="name" placeholder="Enter tournament name" required className="lg:col-span-2" />
              <TextAreaField label="Description" name="description" placeholder="Describe your tournament..." required rows={4} className="lg:col-span-2" />
              <div className="lg:col-span-2">
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Banner Image
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="bannerImage"
                    value={formData.bannerImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/banner.jpg"
                    className="bg-gray-800/70 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 w-full"
                  />
                  <Upload className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Entry & Pricing" icon={DollarSign}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SelectField label="Tournament Type" name="type" options={types} required />
              <SelectField label="Currency Type" name="currencyType" options={currencyTypes} />
              <InputField label="Entry Fee" name="entryFee" type="number" placeholder="0" />
              <InputField label="Prize Pool" name="prizePool" placeholder="Enter prize amount" />
            </div>
          </FormSection>

          <FormSection title="Game Configuration" icon={Settings}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SelectField label="Game Type" name="gameType" options={gameTypes} required />
              <SelectField label="Format" name="format" options={formats} required />
              <SelectField label="Team Size" name="teamSize" options={teamSizes} required />
              <SelectField label="Platform" name="platform" options={platforms} required />
            </div>

            {formData.format === 'custom' && (
              <div className="mt-6">
                <TextAreaField
                  label="Custom Format Description"
                  name="customFormatDescription"
                  placeholder="Describe your custom tournament format..."
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <InputField label="Max Participants" name="maxParticipants" type="number" placeholder="Enter maximum participants" required />
              <div className="relative">
                <InputField label="Discord Server Link" name="discordServerLink" placeholder="https://discord.gg/..." />
                <Link className="w-5 h-5 text-gray-400 absolute right-4 top-9" />
              </div>
            </div>
          </FormSection>

          <FormSection title="Tournament Schedule" icon={Calendar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Registration Start" name="registrationStart" type="datetime-local" required />
              <InputField label="Registration End" name="registrationEnd" type="datetime-local" required />
              <InputField label="Check-in Start" name="checkInStart" type="datetime-local" required />
              <InputField label="Check-in End" name="checkInEnd" type="datetime-local" required />
              <InputField label="Match Start Time" name="matchStartTime" type="datetime-local" required className="md:col-span-2" />
            </div>
          </FormSection>

          <FormSection title="Tournament Rules" icon={Users}>
            <TextAreaField
              label="Rules & Regulations"
              name="rules"
              placeholder="Enter tournament rules and regulations..."
              required
              rows={6}
            />
          </FormSection>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            >
              Create Tournament
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TournamentCreate;
