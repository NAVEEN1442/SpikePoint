import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../src/App.css';
import { checkAuth } from './Services/operations/authAPI';

// Pages & Components
import Signup from './routes/Signup';
import VerifyCodePage from './routes/VerifyCode';
import Login from './routes/Login';
import Home from './routes/Home';
import Dashboard from './routes/Dashboard';
import ForgotPasswordPage from './routes/ForgotPass';
import SetPasswordPage from './routes/SetPassword';
import TournamentList from './routes/TournamentList';
import TournamentCreation from './routes/TournamentCreation';
import TournamentDetails from './routes/TournamentDetails';
import BuddyUp from './routes/BuddyUp';
import SpinnerWrapper from './components/SpinnerWrapper';

// ----------------------------
// Route Wrappers
// ----------------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// ----------------------------
// Main App
// ----------------------------
function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on app load
    dispatch(checkAuth());
  }, [dispatch]);

  // Show spinner while checking auth/loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#111]">
        <SpinnerWrapper />
      </div>
    );
  }

  return (
 
      <div className="relative bg-[#111111] z-10 min-h-screen w-full flex flex-col">
        {/* ---------------------------- */}
        {/* Routes */}
        {/* ---------------------------- */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/verify-code" element={<PublicRoute><VerifyCodePage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/forgot-page" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/set-password" element={<PublicRoute><SetPasswordPage /></PublicRoute>} />
          <Route path="/buddy-up" element={<PublicRoute><BuddyUp /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tournament-list" element={<ProtectedRoute><TournamentList /></ProtectedRoute>} />
          <Route path="/create-tournament" element={<ProtectedRoute><TournamentCreation /></ProtectedRoute>} />
          <Route path="/tournament-details/:id" element={<ProtectedRoute><TournamentDetails /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* ---------------------------- */}
        {/* Toast Notifications */}
        {/* ---------------------------- */}
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="custom-toast" // <- custom class
          />

      </div>

  );
}

export default App;
