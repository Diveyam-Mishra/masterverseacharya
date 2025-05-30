import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [showLoginWidget, setShowLoginWidget] = useState(true);

  useEffect(() => {
    window.otpless = (otplessUser) => {
      // console.log('OTPLESS User Data:', otplessUser);
      
      // Extract user information
      const identity = otplessUser.identities?.[0];
      const name = identity?.name || 'Seeker';
      const email = identity?.email || identity?.identityValue || '';
      const phone = identity?.phone || '';
      const userId = identity?.identityValue || email || phone || `user_${Date.now()}`;
      
      // Store user data in localStorage and cookies
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userPhone', phone);
      
      // Store in cookies as well for persistence
      Cookies.set('userToken', otplessUser.token, { expires: 7 });
      Cookies.set('userName', name, { expires: 7 });
      Cookies.set('userEmail', email, { expires: 7 });
      Cookies.set('userId', userId, { expires: 7 });
      console.log(Cookies.get('userEmail'));
      if (onLogin) onLogin();
      setShowLoginWidget(false);
      navigate('/assistant');
    };
          
    if (window.otplessInit) window.otplessInit();

    // Cleanup function
    return () => {
      delete window.otpless;
    };
  }, [navigate, onLogin]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {showLoginWidget && (
        <div className="w-[90%] max-w-md flex items-center bg-transparent justify-center p-4">
          <div id="otpless-login-page" className="w-full" />
        </div>
      )}
      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/purple-bg-resized-1920x1080.png')" }}
      />
    </div>
  );
}