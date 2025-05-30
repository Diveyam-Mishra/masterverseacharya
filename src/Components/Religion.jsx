import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Religion() {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const items = [
    { id: 'medi', label: 'Meditation', img: '/medi.png' },
    { id: 'budh', label: 'Buddhism', img: '/budh.png' },
    { id: 'tao', label: 'Taoism', img: '/tao.png' },
    { id: 'hindu', label: 'Hinduism', img: '/hindu.png' },
    { id: 'chris', label: 'Christianity', img: '/chris.png' },
    { id: 'islam', label: 'Islam', img: '/islam.png' },
  ];

  const handleBeginClick = () => {
  const token = Cookies.get('userToken');
  if (token) {
    navigate('/assistant');
  } else {
    // Pass where to go after login via state
    navigate('/auth', { state: { from: '/assistant' } });
  }
};


  return (
    <div className="h-[100vh] w-screen flex justify-center bg-transparent overflow-x-hidden box-border mt-10">
      <div className="flex flex-col items-center gap-8 px-5 w-full max-w-screen box-border">
        <div
          className="flex justify-center items-center flex-wrap gap-4 p-5
            bg-white/5 rounded-[50px] backdrop-blur-md font-sans w-full max-w-4xl overflow-x-hidden"
        >
          {items.map(({ id, label, img }) => (
            <div
              key={id}
              id={id}
              onClick={() => setSelectedId(selectedId === id ? null : id)}
              className={`flex items-center gap-2 text-white text-sm px-5 py-2.5
                border border-white/20 rounded-full transition duration-300 cursor-pointer
                ${
                  selectedId === id
                    ? 'shadow-[0_0_12px_2px_rgba(255,215,0,0.8)]'
                    : 'hover:bg-white/20 hover:shadow-md'
                }`}
            >
              <img src={img} alt={label} className="w-5 h-5 object-contain" />
              {label}
            </div>
          ))}
        </div>

        <button
          id="Begin"
          onClick={handleBeginClick}
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-base font-bold
            py-3 px-8 rounded-full shadow-lg transition-all duration-300
            hover:from-purple-300 hover:to-purple-600 hover:shadow-xl hover:-translate-y-1"
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
}
