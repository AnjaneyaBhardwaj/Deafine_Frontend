// Allow override via Vite env variable; default to production backend
// (import.meta.env.* is available in Vite build environment)
const API_BASE_URL = import.meta.env?.VITE_API_BASE || 'https://deafine-backend.onrender.com';

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
  // Build ws/wss URL from API_BASE_URL robustly
  const base = new URL(API_BASE_URL);
  base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
  // Ensure path joins cleanly even if base had a trailing slash
  base.pathname = base.pathname.replace(/\/+$/, '') + '/ws/transcribe';
  base.search = '';
  base.hash = '';
  const wsUrl = base.toString();
  console.log('🔌 Connecting WebSocket to:', wsUrl);
  return new WebSocket(wsUrl);
};

// Get all sessions
export const getSessions = async () => {
  const response = await fetch(`${API_BASE_URL}/sessions`);
  if (!response.ok) {
    throw new Error('Failed to get sessions');
  }
  return response.json();
};
