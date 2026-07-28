const isBrowser = typeof window !== 'undefined';
const isProdHost = isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = import.meta.env.VITE_API_URL || (isProdHost ? "https://by-jessika-backend.onrender.com" : "");
export const BACKEND_URL = import.meta.env.VITE_API_URL || (isProdHost ? "https://by-jessika-backend.onrender.com" : "http://localhost:3000");
