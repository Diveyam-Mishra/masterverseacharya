import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar({ title, isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const firstInitial = userName?.charAt(0).toUpperCase() || 'U';
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${firstInitial}&backgroundType=gradientLinear&fontSize=40`;

  return (
    <nav className="bg-transparent w-full border-b border-white/10">
      <div className="w-full max-w-screen-xl mx-auto flex justify-between items-center px-6 py-3">
        <span className="text-white text-xl font-semibold">{title}</span>

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-white hover:bg-white/20 transition"
            >
              <img src={avatarUrl} alt="User Avatar" className="h-6 w-6 rounded-full object-cover" />
              <span className="font-medium">{userName}</span>
              <svg
                className={`w-4 h-4 transform transition ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium">
                  Option 1
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium">
                  Option 2
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium">
                  Option 3
                </button>
                <hr />
                <button
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-bold"
                  onClick={() => {
  onLogout();
  localStorage.removeItem('userName'); // clear username on logout
  setDropdownOpen(false);
}}

                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              className="bg-black text-white font-bold px-5 py-1 rounded-full border border-black hover:bg-[#222] hover:shadow-[0_0_20px_rgba(162,4,230,0.3)] transition"
              onClick={() => navigate('/auth')}
            >
              Log In
            </button>

            <span
              onClick={() => navigate('/auth?mode=signup')}
              className="text-sm text-white hover:text-white cursor-pointer transition font-semibold"
            >
              Sign up for free
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
