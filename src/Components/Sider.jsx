import { FaHome, FaSearch, FaCog, FaBolt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
export default function Sider() {
  return (
    <div className="w-[60px] h-screen bg-purple-50 flex flex-col justify-between items-center py-2 shadow-md fixed left-0 top-0 z-10">
       <div className="flex flex-col items-center gap-5">
        <Link to="/">
          <img 
            src="/Small_logo.png" 
            alt="Logo" 
            className="w-10 h-10 object-contain" 
          />
        </Link>
        <FaHome className="text-[18px] text-gray-600 hover:text-purple-800 cursor-pointer my-2" />
        
        <FaBolt className="text-[18px] text-gray-600 hover:text-purple-800 cursor-pointer my-2" />

        <FaSearch className="text-[18px] text-gray-600 hover:text-purple-800 cursor-pointer my-2" />
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-6">
        <FaCog className="text-[18px] text-gray-600 hover:text-purple-800 cursor-pointer my-4" />
      </div>
    </div>
  );
}
