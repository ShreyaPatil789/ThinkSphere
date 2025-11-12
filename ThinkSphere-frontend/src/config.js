const fromEnv = import.meta.env.VITE_API_URL;
export const API_BASE_URL = fromEnv || (import.meta.env.PROD ? 'https://thinksphere-c5xi.onrender.com' : 'http://localhost:5000');
