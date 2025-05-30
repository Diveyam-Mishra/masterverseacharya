import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    name: '',
    email: '',
    userId: '',
    phone: '',
    token: ''
  });

  useEffect(() => {
    // Check for existing authentication
    const token = Cookies.get('userToken');
    const name = Cookies.get('userName');
    const email = Cookies.get('userEmail');
    const userId = Cookies.get('userId');
    
    if (token && userId) {
      setUser({
        isAuthenticated: true,
        name: name || '',
        email: email || '',
        userId: userId,
        phone: localStorage.getItem('userPhone') || '',
        token: token
      });
    }
  }, []);

  const login = () => {
    const token = Cookies.get('userToken');
    const name = Cookies.get('userName');
    const email = Cookies.get('userEmail');
    const userId = Cookies.get('userId');
    
    setUser({
      isAuthenticated: true,
      name: name || '',
      email: email || '',
      userId: userId || '',
      phone: localStorage.getItem('userPhone') || '',
      token: token || ''
    });
  };

  const logout = () => {
    // Clear all stored data
    Cookies.remove('userToken');
    Cookies.remove('userName');
    Cookies.remove('userEmail');
    Cookies.remove('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userPhone');
    
    setUser({
      isAuthenticated: false,
      name: '',
      email: '',
      userId: '',
      phone: '',
      token: ''
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};