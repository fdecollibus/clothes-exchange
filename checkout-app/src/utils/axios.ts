import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Verbindung zum Server fehlgeschlagen. Bitte überprüfen Sie, ob der Server läuft.');
    }
    throw error;
  }
);

export default api; 