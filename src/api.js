const API_BASE_URL = 'https://deafine-backend.onrender.com';

// Health check
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};

// Transcribe uploaded file
export const postTranscribe = async (file) => {
  const formData = new FormData();
  formData.append('audio_file', file);

  const response = await fetch(`${API_BASE_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }
  
  return response.json();
};

// Get session status
export const getSessionStatus = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}`);
  if (!response.ok) {
    throw new Error('Failed to get session status');
  }
  return response.json();
};

// Get session transcript
export const getSessionTranscript = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}/transcript`);
  if (!response.ok) {
    throw new Error('Failed to get transcript');
  }
  return response.json();
};

// Stream audio for real-time transcription
export const postTranscribeStream = async (audioChunk) => {
  const formData = new FormData();
  formData.append('audio_chunk', audioChunk);

  const response = await fetch(`${API_BASE_URL}/transcribe/stream`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to stream audio');
  }
  
  return response.json();
};

// WebSocket connection for real-time transcription
export const createWebSocketConnection = () => {
  // use the same base URL as the REST API and switch protocol to ws/wss
  try {
    const url = new URL(API_BASE_URL);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return new WebSocket(`${protocol}//${url.host}/ws/transcribe`);
  } catch (e) {
    // fallback to localhost websocket
    return new WebSocket(`ws://${API_BASE_URL}/ws/transcribe`);
  }
};

// Get all sessions
export const getSessions = async () => {
  const response = await fetch(`${API_BASE_URL}/sessions`);
  if (!response.ok) {
    throw new Error('Failed to get sessions');
  }
  return response.json();
};
