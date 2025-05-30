import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

export default function Navbar2() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const firstInitial = user.name?.charAt(0).toUpperCase() || 'U';
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${firstInitial}&backgroundType=gradientLinear&fontSize=40`;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="h-[60px] bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 relative z-50">
      
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <img src="/small_logo2.png" alt="Logo" className="h-9 w-9" />
        <div>
          <div className="text-lg text-gray-900 flex items-baseline font-bold">
            Masterverse Acharya
          </div>
          {/* text-gray-500 */}
          <div className="text-xs mt-[2px] text-purple-800 font-semibold"> 
            Spiritual guidance and philosophical insights
          </div>
        </div>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4">
        <button className="bg-purple-700 hover:bg-purple-800 text-white py-1.5 px-4 text-sm font-medium rounded-full transition-colors">
          Memory Sessions
        </button>

        {/* Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white px-3 py-1 shadow-sm border border-gray-200 rounded-full"
          >
            <img src={avatarUrl} alt="User Avatar" className="h-7 w-7 rounded-full object-cover" />
            <div className="flex flex-col items-start">
              <span className="text-sm text-gray-800">{user.name}</span>
              {user.email && (
                <span className="text-xs text-gray-500">{user.email}</span>
              )}
            </div>
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
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
              {/* User Info Section */}
              {/* <div className="px-4 py-3 border-b border-gray-100">
                <div className="font-medium text-gray-900">{user.name}</div>
                {user.email && (
                  <div className="text-sm text-gray-500">{user.email}</div>
                )}
              </div> */}
              
              {/* Menu Options */}
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium">
                Spiritual Preferences
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium">
                Export Sessions
              </button>
              <hr />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-bold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}