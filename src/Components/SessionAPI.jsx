const API_BASE_URL = 'http://localhost:8080';
const APP_NAME = 'masterversacharya';


export const createAutoSession = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apps/${APP_NAME}/users/${email}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      })
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Session created:', data);
    return data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// List all sessions for a specific user
export const listUserSessions = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apps/${APP_NAME}/users/${userId}/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    throw error;
  }
};




export const sendMessage = async ({ app_name, session_id, new_message, user_id }) => {
  const payload = {
    app_name,
    user_id,
    session_id,
    new_message,
  };
  
  console.log('Sending API request with payload:', JSON.stringify(payload, null, 2));
  console.log('API URL:', `${API_BASE_URL}/run`);

  try {
    const response = await fetch(`${API_BASE_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Detailed error in sendMessage:', error);
    throw error;
  }
};

export const sendMessageStream = async ({ app_name, session_id, new_message, user_id, onChunk }) => {
  const response = await fetch(`${API_BASE_URL}/run_sse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_name,
      user_id,
      session_id,
      new_message,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  let done = false;
  let fullText = '';

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;

    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;

    // Stream individual text parts if needed
    if (onChunk) onChunk(chunk);
  }

  return fullText;
};


// Get session details
export const getSessionDetails = async (userId, sessionId) => {
  console.log(`Fetching session details for userId: ${userId}, sessionId: ${sessionId}`);
  try {
    const response = await fetch(`${API_BASE_URL}/apps/${APP_NAME}/users/${userId}/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Session details:', data.events);
    return data;
  } catch (error) {
    console.error('Error fetching session details:', error);
    throw error;
  }
};

// Delete a session
export const deleteSession = async (userId, sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apps/${APP_NAME}/users/${userId}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};