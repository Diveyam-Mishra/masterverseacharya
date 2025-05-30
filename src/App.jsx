import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Religion from './Components/Religion';
import Navbar from './Components/Navbar';
import SpiritualAssistant from './Components/SpiritualAssistant';
import AuthPage from './Components/AuthPage';
import { UserProvider, useUser } from './Components/UserContext';
import bgImage from '/public/purple-bg-resized-1920x1080.png';

function AppRoutes() {
  const location = useLocation();
  const showNavbar = location.pathname === '/';
  const { user, login, logout } = useUser();

  return (
    <div
      className="w-screen h-[100vh] overflow-hidden sm:overflow-auto bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {showNavbar && (
        <div className="absolute top-0 left-0 w-full z-10">
          <Navbar
            title={<img src="/Logo SVG 2.png" alt="Logo" className="h-12" />}
            isAuthenticated={user.isAuthenticated}
            userName={user.name}
            onLogout={logout}
          />
        </div>
      )}

      <Routes>
        <Route path="/auth" element={<AuthPage onLogin={login} />} />
        <Route path="/assistant" element={<SpiritualAssistant />} />
        <Route
          path="/"
          element={
            <div className="w-full h-full flex flex-col justify-center items-center text-center px-4 z-0 relative pt-24 sm:pt-32">
              <div className="text-white">
                <h1 className="text-4xl font-bold">Welcome to</h1>
                <h1 className="text-5xl font-extrabold text-purple-200 mt-2">
                  Masterverse <span className="text-white">Acharya ✨</span>
                </h1>
                <p className="text-base text-gray-300 max-w-xl mx-auto mt-6 leading-relaxed">
                  Begin your journey of spiritual growth and philosophical discovery. Explore <br />
                  ancient wisdom, compare different traditions, and find guidance for your path.
                </p>
              </div>
              <Religion />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;