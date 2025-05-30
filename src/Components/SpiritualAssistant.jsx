import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Navbar2 from './Navbar2';
import Sider from './Sider';
import Sidebar from './Sidebar';
import { useUser } from './UserContext';

import { createAutoSession, sendMessage, getSessionDetails, sendMessageStream } from './SessionAPI';
import Avatar from './Avatar';

export default function SpiritualAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize with a new session when component mounts
  // useEffect(() => {
  //   if (user.isAuthenticated && user.id && !currentSessionId) {
  //     initializeNewSession();
  //   }
  // }, [user.isAuthenticated, user.id]);
  
useEffect(() => {
  if (user.isAuthenticated && user.email && !currentSessionId) {
    console.log('User authenticated, checking for existing sessions...');
    loadExistingSessionOrCreate();
  }
}, [user.isAuthenticated, user.email]);

const loadExistingSessionOrCreate = async () => {
  if (!user.email) return;

  try {
    // First, try to get existing sessions
    const { listUserSessions } = await import('./SessionAPI');
    const response = await listUserSessions(user.email);
    const sessions = response.sessions || [];
    
    if (sessions.length > 0) {
      // Use the most recent session
      const mostRecentSession = sessions[0]; // Assuming sessions are sorted by date
      console.log('Using existing session:', mostRecentSession.session_id || mostRecentSession.id);
      setCurrentSessionId(mostRecentSession.session_id || mostRecentSession.id);
      
      // Load session history if needed
      try {
        const sessionDetails = await getSessionDetails(user.email, mostRecentSession.session_id || mostRecentSession.id);
        if (sessionDetails.messages) {
          setMessages(sessionDetails.messages);
        }
      } catch (error) {
        console.error('Failed to load session history:', error);
      }
    } else {
      // No existing sessions, create a new one
      console.log('No existing sessions, creating new one...');
      await initializeNewSession();
    }
  } catch (error) {
    console.error('Failed to load sessions, creating new one:', error);
    await initializeNewSession();
  }
};

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const initializeNewSession = async () => {
  if (!user.email) return;

  try {
    const newSession = await createAutoSession(user.email);
    console.log('New session created:', newSession);
    
    // Fix: Check both possible property names for session ID
    const sessionId = newSession.session_id || newSession.id;
    console.log('Session ID to use:', sessionId);
    
    setCurrentSessionId(sessionId); 
    setMessages([]); // Clear messages for new session
    
    return sessionId;
  } catch (error) {
    console.error('Failed to create initial session:', error);
    return null;
  }
};


  const handleSessionSelect = async (sessionId) => {
    setCurrentSessionId(sessionId);
    setMessages([]); // Clear current messages

    // Load session history if needed
    try {
      const sessionDetails = await getSessionDetails(user.email, sessionId);
      // If the API returns message history, set it here
      if (sessionDetails.messages) {
        setMessages(sessionDetails.messages);
      }
    } catch (error) {
      console.error('Failed to load session details:', error);
    }
  };

  const handleSend = async () => {
  console.log('handleSend called with:', { sessionId: currentSessionId});
  
  if (!input.trim() || !user.email) {
    console.log('Validation failed:', { inputEmpty: !input.trim(), noUserId: !user.email });
    return;
  }
    if (!input.trim() || !user.email) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    const text = input;
    setInput('');

    // Reset textarea height after clearing input
    if (textareaRef.current) {
      textareaRef.current.style.height = '64px';
    }

    setLoading(true);
    console.log('Sending message:', {currentSessionId});
    try {
      const response = await sendMessage({
        app_name: "masterversacharya",
        session_id: currentSessionId,
        new_message: {
          role: "user",
          parts: [{ text }],
        },
        user_id: user.email,
      });

      const replyText = response?.[0]?.content?.parts?.[0]?.text || '[No response]';
      const botMsg = { role: 'assistant', content: replyText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendStream = async () => {
    if (!input.trim() || !user.id) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    const text = input;
    setInput('');

    // Reset textarea height after clearing input
    if (textareaRef.current) {
      textareaRef.current.style.height = '64px';
    }

    setLoading(true);
    let streamedText = '';

    try {
      await sendMessageStream({
        app_name: "masterversacharya",
        session_id: "1e4c6e62-50a5-45e7-a001-e7a7caa24d03",
        new_message: {
          role: "user",
          parts: [{ text }],
        },
        streaming: true,
        user_id: user.id,
        onChunk: (chunk) => {
          streamedText += chunk;
          const botMsg = { role: 'assistant', content: streamedText };
          setMessages((prev) => [...prev.slice(0, -1), botMsg]);
        },
      });

      const botMsg = { role: 'assistant', content: streamedText || '[No response]' };
      setMessages((prev) => [...prev.slice(0, -1), botMsg]);
    } catch (error) {
      console.error('Failed to stream message:', error);
      const errorMsg = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  };

  const handleFileAttachment = () => {
    // Implement file attachment logic
    console.log('File attachment clicked');
  };

  const handleEmojiClick = () => {
    // Implement emoji picker logic
    console.log('Emoji clicked');
  };

  const handleVoiceClick = () => {
    // Implement voice recording logic
    console.log('Voice clicked');
  };

  if (!user.isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in to continue</h2>
          <p className="text-gray-600">You need to be authenticated to use the spiritual assistant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans overflow-hidden flex-col sm:flex-row">
      {/* Sidebars */}
      <div className="hidden sm:block">
        <Sider />
      </div>
      <div className="hidden sm:block">
        <Sidebar
          onSessionSelect={handleSessionSelect}
          currentSessionId={currentSessionId}
          onNewChat={initializeNewSession}
        />
      </div>

      <div className="flex flex-col flex-1 bg-violet-50 overflow-hidden">
        <Navbar2 />

        {/* Chat Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col bg-[#F8FAFC]">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Welcome, {user.name}! 🙏
                </h2>
                <p className="text-gray-600 mb-6 text-xs">
                  I'm your spiritual assistant, here to guide you on your journey of wisdom and self-discovery.
                  Ask me anything about philosophy, meditation, or spiritual practices.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4 flex-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-3 rounded-lg max-w-full sm:max-w-[70%] text-sm shadow-sm ${msg.role === 'user'
                    ? 'bg-[#6F2FB8] text-white'
                    : 'bg-[#F0E3FF80] text-gray-800 border border-gray-200'
                    }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg text-sm shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="w-full mx-auto flex flex-col bg-white border border-gray-300 rounded-2xl shadow-sm p-2 sm:px-4 mt-4">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              className="w-full text-xs bg-transparent resize-none min-h-[64px] max-h-[200px] overflow-auto outline-none scrollbar-hide text-start align-top leading-6"
              placeholder="Ask me about spirituality, philosophy, or life guidance..."
              style={{ height: '64px' }}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (e.target) {
                  e.target.style.height = '64px'; // Reset to minimum height
                  const newHeight = Math.max(64, Math.min(e.target.scrollHeight, 200));
                  e.target.style.height = newHeight + 'px';
                }
              }}
              onKeyDown={handleKeyPress}
              disabled={loading}
              rows={3}
            />
            <div className="w-full flex justify-end mt-2">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#6F2FB8',
                  '&:hover': {
                    backgroundColor: '#7c3aed',
                  },
                  color: 'white'
                }}
                endIcon={<SendIcon />}
                onClick={handleSend}
                disabled={!input.trim() || loading}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}