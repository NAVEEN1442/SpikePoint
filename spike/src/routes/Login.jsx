import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.jpg';
import loginIMG from '../assets/loginIMG.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  logIn } from '../Services/operations/authAPI';


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });



  

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedEmail');
    }

    // Dispatch login action
    dispatch(logIn(formData.email, formData.password, navigate));
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMeFlag = localStorage.getItem('rememberMe');
    
    if (rememberMeFlag === 'true' && rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
   <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-[50px] px-4 py-12">
      
      {/* Left Side (Form Section) */}
      <div className="w-full max-w-xl flex flex-col justify-center h-full">
        {/* Logo */}
        <div className="mb-6 flex justify-start">
          <div className="w-[120px] h-[180px] rounded-lg flex items-center justify-center">
           <Link to={"/"} ><img src={logo} alt="Logo" /></Link>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
        <p className="text-sm text-gray-300 mb-6">
          Login to access your travelwise account
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md mb-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            required
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-400 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 accent-red-500" 
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            <Link to="/forgot-page">
              <span className="text-sm text-red-400 cursor-pointer hover:text-red-300 transition-colors">
                Forgot Password
              </span>
            </Link>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white py-3 rounded-md w-full mb-4 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-300 mb-2">
          Don't have an account? 
          <Link to="/signup">
            <span className="text-red-400 cursor-pointer hover:text-red-300 transition-colors ml-1">Sign up</span>
          </Link>
        </p>

        <p className="text-sm text-center text-gray-300 mb-2">Or login with</p>

        <div className="bg-gray-800 border border-gray-600 p-3 rounded-md text-center flex items-center justify-center cursor-pointer hover:bg-gray-700 hover:border-red-500 transition-all">
          <span className="text-sm text-gray-200">Google</span>
        </div>
      </div>

      {/* Right Side (Image Section) */}
      <div className="w-full max-w-md">
        <img
          src={loginIMG}
          alt="Login Illustration"
          className="w-full h-full object-contain rounded-xl"
        />
      </div>
    </div>
  );
};

export default Login;