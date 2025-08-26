import NavBar from '@/components/Navbar'
import React, { useState } from 'react'
import { Camera, Upload, Users, Trophy, Shield, Calendar, Mail, Phone, User } from 'lucide-react'

function Dashboard() {
  // Mock user data based on provided information
  const [userData] = useState({
    _id: "68ac7467653994e6f4e65ac9",
    fullName: "ADMIN1",
    userName: "admin001",
    phoneNumber: "1111111111",
    email: "skumarnaveen1442@gmail.com",
    createdTournaments: 1,
    activeTournaments: 0,
    pastTournaments: 0,
    activeTeams: 0,
    defaultTeam: null,
    profileImage: "",
    role: "player",
    joinedTournaments: 0,
    createdAt: "2025-08-25T14:34:15.272+00:00"
  })

  const [bannerImage, setBannerImage] = useState("")
  const [profileImage, setProfileImage] = useState(userData.profileImage)

  const handleBannerUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setBannerImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProfileImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111111' }}>
      <NavBar />
      
      {/* Banner Section */}
      <div className="relative">
        <div 
          className="h-64 relative overflow-hidden"
          style={{
            backgroundImage: bannerImage ? `url(${bannerImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: bannerImage ? undefined : '#1f1f1f'
          }}
        >
          {!bannerImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700" />
          )}
          
          {/* Banner Upload Button */}
          <label className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 rounded-lg p-3 cursor-pointer backdrop-blur-sm border border-gray-700">
            <Upload className="h-5 w-5 text-gray-300" />
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
          </label>
          
          {/* Profile Section */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-gray-700 shadow-2xl overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-500 rounded-full p-2 cursor-pointer shadow-lg transition-colors border border-blue-500">
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pt-20 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* User Info Section */}
          <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{userData.fullName}</h1>
                <p className="text-lg text-gray-400 mb-4">@{userData.userName}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">{userData.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span className="capitalize text-gray-300">{userData.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="font-semibold text-gray-200">
                    {new Date(userData.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Tournaments Created</p>
                  <p className="text-3xl font-bold text-blue-400">{userData.createdTournaments}</p>
                </div>
                <div className="bg-blue-900 bg-opacity-50 rounded-full p-3">
                  <Trophy className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Tournaments</p>
                  <p className="text-3xl font-bold text-green-400">{userData.activeTournaments}</p>
                </div>
                <div className="bg-green-900 bg-opacity-50 rounded-full p-3">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Joined Tournaments</p>
                  <p className="text-3xl font-bold text-purple-400">{userData.joinedTournaments}</p>
                </div>
                <div className="bg-purple-900 bg-opacity-50 rounded-full p-3">
                  <Trophy className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Teams</p>
                  <p className="text-3xl font-bold text-orange-400">{userData.activeTeams}</p>
                </div>
                <div className="bg-orange-900 bg-opacity-50 rounded-full p-3">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tournament History */}
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tournament Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                  <span className="text-gray-400">Tournaments Created</span>
                  <span className="font-semibold text-gray-200">{userData.createdTournaments}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                  <span className="text-gray-400">Active Tournaments</span>
                  <span className="font-semibold text-gray-200">{userData.activeTournaments}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                  <span className="text-gray-400">Past Tournaments</span>
                  <span className="font-semibold text-gray-200">{userData.pastTournaments}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                  <span className="text-gray-400">Joined Tournaments</span>
                  <span className="font-semibold text-gray-200">{userData.joinedTournaments}</span>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Team Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                  <span className="text-gray-400">Active Teams</span>
                  <span className="font-semibold text-gray-200">{userData.activeTeams}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                  <span className="text-gray-400">Default Team</span>
                  <span className="font-semibold text-gray-200">
                    {userData.defaultTeam || "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                  <span className="text-gray-400">Friends</span>
                  <span className="font-semibold text-gray-200">0</span>
                </div>
                
                {!userData.defaultTeam && (
                  <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-800">
                    <p className="text-sm text-blue-300">
                      You haven't set a default team yet. Create or join a team to get started!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-colors border border-blue-500">
                <Trophy className="h-4 w-4" />
                Create Tournament
              </button>
              <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg transition-colors border border-green-500">
                <Users className="h-4 w-4" />
                Join Team
              </button>
              <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-lg transition-colors border border-purple-500">
                <Calendar className="h-4 w-4" />
                View Schedule
              </button>
              <button className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-3 rounded-lg transition-colors border border-orange-500">
                <User className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard