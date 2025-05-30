// src/utils/api.js
const BASE_URL = 'http://localhost:5000'; // Change if different

export const createAutoSession = async (userId) => {
  const res = await fetch(`${BASE_URL}/auto_session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, app_name: 'masterversacharya' })
  });
  return res.json();
};

export const sendMessage = async ({ session_id, text, user_id }) => {
  const res = await fetch(`${BASE_URL}/run_sse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_name: 'masterversacharya',
      user_id,
      session_id,
      new_message: {
        role: 'user',
        parts: [{ text }]
      },
      streaming: false // Use true if using SSE streaming
    })
  });
  return res.json();
};

export const listSessions = async (userId) => {
  const res = await fetch(`${BASE_URL}/list_all_sessions?user_id=${userId}&app_name=masterversacharya`);
  return res.json();
};

export const getSessionInfo = async (sessionId, userId) => {
  const res = await fetch(`${BASE_URL}/session_information?user_id=${userId}&app_name=masterversacharya&session_id=${sessionId}`);
  return res.json();
};
