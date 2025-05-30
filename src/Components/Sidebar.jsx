import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { listUserSessions, createAutoSession } from './SessionAPI';

export default function Sidebar({ onSessionSelect, currentSessionId, onNewChat }) {
  const [isOpen, setIsOpen] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();

  // Load user sessions when component mounts
  useEffect(() => {
    if (user.isAuthenticated && user.email) {
      loadUserSessions();
    }
  }, [user.isAuthenticated, user.email]);

  const loadUserSessions = async () => {
    if (!user.email) return;
    
    setLoading(true);
    try {
      // Since your API returns an array directly, not wrapped in { sessions: [...] }
      const response = await listUserSessions(user.email);
      console.log('Raw sessions response:', JSON.stringify(response, null, 2));
      
      // Handle both possible response formats
      const sessionsList = Array.isArray(response) ? response : (response.sessions || []);
      
      // Sort sessions by last_update_time (most recent first)
      const sortedSessions = sessionsList.sort((a, b) => 
        (b.last_update_time || 0) - (a.last_update_time || 0)
      );
      
      setSessions(sortedSessions);
      
      // Auto-select the most recent session if none is currently selected
      if (sortedSessions.length > 0 && !currentSessionId && onSessionSelect) {
        console.log('Auto-selecting most recent session:', sortedSessions[0].id);
        onSessionSelect(sortedSessions[0].id);
      }
      
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    if (!user.email) return;
    
    try {
      const newSession = await createAutoSession(user.email);
      console.log('New session created in sidebar:', newSession);
      
      // Add the new session to the top of the list
      setSessions(prev => [newSession, ...prev]);
      
      if (onSessionSelect) {
        onSessionSelect(newSession.id);
      }
      
      // Call the parent's onNewChat if provided
      if (onNewChat) {
        onNewChat();
      }
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const handleSessionClick = (sessionId) => {
    console.log('Session clicked:', sessionId);
    if (onSessionSelect) {
      onSessionSelect(sessionId);
    }
  };

  // Filter sessions based on search term
  const filteredSessions = sessions.filter(session => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session.id.toLowerCase().includes(searchLower) ||
      session.app_name.toLowerCase().includes(searchLower) ||
      session.user_id.toLowerCase().includes(searchLower)
    );
  });

  // Group sessions by date
  const groupSessionsByDate = (sessions) => {
    const now = Date.now() / 1000; // Current time in seconds
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    sessions.forEach(session => {
      const sessionTime = session.last_update_time || 0;
      const sessionDate = new Date(sessionTime * 1000); // Convert from seconds to milliseconds
      
      if (sessionDate.toDateString() === today.toDateString()) {
        groups.today.push(session);
      } else if (sessionDate.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(session);
      } else if (sessionDate >= weekAgo) {
        groups.thisWeek.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate(filteredSessions);

  // Helper function to format timestamp
  const formatSessionTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get session display name
  const getSessionDisplayName = (session) => {
    // You can customize this based on your needs
    return `Chat ${session.id.slice(-8)}`;
  };

  const SessionGroup = ({ title, sessions }) => {
    if (sessions.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-medium text-[#6b6b6b] uppercase mb-2">{title}</h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors group hover:bg-[#eae2f8]
                ${currentSessionId === session.id 
                  ? 'bg-purple-100 text-purple-800 border-l-2 border-purple-600' 
                  : 'text-[#333]'
                }`}
            >
              <div className="truncate font-medium">
                {getSessionDisplayName(session)}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                <span>{formatSessionTime(session.last_update_time)}</span>
                  {/* <span className="text-[10px] opacity-50">
                    {session.id.slice(-4)}
                  </span> */}
              </div>
              {/* Show additional info on hover or selection */}
              {currentSessionId === session.id && (
                <div className="text-xs text-purple-600 mt-1 opacity-75">
                  Active Session
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <div
        className={`h-screen bg-[#f6f2fa] border-r border-[#e0e0e0] ml-[60px] flex flex-col py-4 overflow-y-auto
          transition-all duration-300 ease-in-out relative
          ${isOpen ? 'w-[280px]' : 'w-[60px]'}
        `}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-base font-semibold text-[#3a3a3a]">
                Chats ({sessions.length})
              </h2>
              <button 
                onClick={handleNewChat}
                className="text-xl text-[#6b6b6b] hover:text-[#4b4b4b] hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 font-bold"
                title="New Chat"
              >
                +
              </button>
            </div>

            {/* Search */}
            <div className="px-4 mb-4">
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="px-4 py-2 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span>Loading sessions...</span>
                </div>
              </div>
            )}

            {/* Sessions */}
            {!loading && (
              <div className="px-4 flex-1 overflow-y-auto">
                <SessionGroup title="Today" sessions={sessionGroups.today} />
                <SessionGroup title="Yesterday" sessions={sessionGroups.yesterday} />
                <SessionGroup title="This Week" sessions={sessionGroups.thisWeek} />
                <SessionGroup title="Older" sessions={sessionGroups.older} />
                
                {filteredSessions.length === 0 && !loading && (
                  <div className="text-center text-sm text-gray-500 mt-8">
                    {sessions.length === 0 ? (
                      <div>
                        <p className="mb-2">No chats yet</p>
                        <p className="text-xs">Click the + button to start your first conversation</p>
                      </div>
                    ) : (
                      'No matching chats'
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Debug Info (remove in production) */}
            {/* {process.env.NODE_ENV === 'development' && sessions.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-400">
                <details>
                  <summary className="cursor-pointer">Debug Info</summary>
                  <div className="mt-2 space-y-1">
                    <div>Total Sessions: {sessions.length}</div>
                    <div>Current Session: {currentSessionId || 'None'}</div>
                    <div>Most Recent: {sessions[0]?.id.slice(-8) || 'None'}</div>
                  </div>
                </details>
              </div>
            )} */}
          </>
        )}
      </div>
    </div>
  );
}