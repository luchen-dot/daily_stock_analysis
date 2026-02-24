// Use relative paths so every request (including EventSource for SSE) goes
// through the same origin. In dev, Vite proxies /api → http://127.0.0.1:8000.
// Override with VITE_API_URL env var when targeting a remote backend.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
