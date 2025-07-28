import { LogIn, LogOut, Wallet, Trophy, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setUser } from '../slices/authSlice';
import { toast } from 'react-hot-toast';
import { Button } from './ui/button';

export default function NavBar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.clear();
    toast.success('Logged out successfully!');
    setShowLogoutModal(false);
    navigate('/');
  };

  const closeModal = () => setShowLogoutModal(false);

  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className="h-16 md:h-20 w-full"></div>
      
      {/* Desktop Floating Navbar */}
      <div className="hidden md:block fixed top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-3">
          
          {/* First Box - Navigation Links */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl px-4 lg:px-6 py-3 border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 lg:gap-6 text-white">
              <Link to="/" className="text-sm font-medium hover:text-[#ff4655] transition duration-200">
                Home
              </Link>
              <Link to="/tournament-list" className="text-sm font-medium hover:text-[#ff4655] transition duration-200">
                Tournaments
              </Link>
              <Link to="/buddy-up" className="text-sm font-medium hover:text-[#ff4655] transition duration-200">
                Buddy Up
              </Link>
              
              {token || user ? (
                <button onClick={handleLogout}>
                  <Button variant="destructive" size="sm">Logout</Button>
                </button>
              ) : (
                <Link to="/login">
                  <Button size="sm">Login</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Second Box - Action Buttons */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3">
              <Link to="/buddy-up">
                <button className="p-2 rounded-lg hover:bg-white/10 transition duration-200">
                  <Trophy className="w-5 h-5 text-white" />
                </button>
              </Link>
              <Link to="/wallet">
                <button className="p-2 rounded-lg hover:bg-white/10 transition duration-200">
                  <Wallet className="w-5 h-5 text-white" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="text-white font-bold text-xl">
            Logo
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-xl">
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/" 
                className="text-white font-medium hover:text-[#ff4655] transition duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/tournament-list" 
                className="text-white font-medium hover:text-[#ff4655] transition duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tournaments
              </Link>
              <Link 
                to="/buddy-up" 
                className="text-white font-medium hover:text-[#ff4655] transition duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Buddy Up
              </Link>
              
              <div className="flex items-center gap-3 pt-2 border-t border-white/20">
                <Link to="/buddy-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition duration-200">
                    <Trophy className="w-5 h-5 text-white" />
                  </button>
                </Link>
                <Link to="/wallet" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition duration-200">
                    <Wallet className="w-5 h-5 text-white" />
                  </button>
                </Link>
                
                {token || user ? (
                  <button onClick={handleLogout}>
                    <Button variant="destructive" size="sm">Logout</Button>
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1a1a1a] rounded-xl p-6 md:p-8 w-full max-w-md text-white shadow-2xl border border-white/10">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Confirm Logout</h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to log out? You'll need to log in again to continue.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-white border border-gray-500 rounded-lg hover:bg-white hover:text-black transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm bg-[#ff4655] text-white rounded-lg hover:bg-[#e53a49] transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}