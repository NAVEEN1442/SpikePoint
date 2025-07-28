import React, { useState } from 'react';
import signupIMG from '../assets/signupIMG.png';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sendotp } from '../Services/operations/authAPI';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const { fullName, userName, phoneNumber, email, password, confirmPassword } = formData;
    
    if (!fullName || !userName || !phoneNumber || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!agreed) {
      alert('Please agree to the terms and privacy policies');
      return;
    }
    
    // Dispatch sendotp action
    dispatch(sendotp(fullName, userName, phoneNumber, email, password, confirmPassword, navigate));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-[50px] px-4 py-12">
      <div className="w-full max-w-md">
        <img src={signupIMG} alt="Signup" className="w-full h-full object-contain rounded-xl" />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col justify-center h-full">
        <div className="flex justify-end mb-6">
          <div className="w-[120px] h-[160px] rounded-lg flex items-center justify-center">
            <Link to={"/"} ><img src={logo} alt="Logo" /></Link>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Sign up</h2>
        <p className="text-sm text-gray-300 mb-6">Let's get you all set up so you can access your personal account.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input 
            type="text" 
            name="fullName" 
            value={formData.fullName}
            onChange={handleChange} 
            placeholder="Full Name" 
            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" 
            required 
          />
          <input 
            type="text" 
            name="userName" 
            value={formData.userName}
            onChange={handleChange} 
            placeholder="Username" 
            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" 
            required 
          />
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            placeholder="Email" 
            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" 
            required 
          />
          <input 
            type="tel" 
            name="phoneNumber" 
            value={formData.phoneNumber}
            onChange={handleChange} 
            placeholder="Phone Number" 
            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" 
            required 
          />
        </div>

        <input 
          type="password" 
          name="password" 
          value={formData.password}
          onChange={handleChange} 
          placeholder="Password" 
          className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md mb-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" 
          required 
        />
        <input 
          type="password" 
          name="confirmPassword" 
          value={formData.confirmPassword}
          onChange={handleChange} 
          placeholder="Confirm Password" 
          className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" 
          required 
        />

        <div className="flex items-center mb-4">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mr-2 accent-red-500" 
            required 
          />
          <span className="text-sm text-gray-300">
            I agree to all the <span className="text-red-400">Terms</span> and <span className="text-red-400">Privacy Policies</span>
          </span>
        </div>

        <button 
          type="submit" 
          className="bg-red-600 text-white py-3 rounded-md w-full mb-4 hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-red-500/25"
          disabled={!agreed}
        >
          Create account
        </button>

        <p className="text-sm text-center text-gray-300 mb-2">
          Already have an account? 
          <Link to="/login">
            <span className="text-red-400 cursor-pointer hover:text-red-300 transition-colors ml-1">Login</span>
          </Link>
        </p>
        <p className="text-sm text-center text-gray-300 mb-2">Or Sign up with</p>
        <div className="bg-gray-800 border border-gray-600 p-3 rounded-md text-center flex items-center justify-center cursor-pointer hover:bg-gray-700 hover:border-red-500 transition-all">
          <span className="text-sm text-gray-200">Google</span>
        </div>
      </form>
    </div>
  );
};

export default Signup;