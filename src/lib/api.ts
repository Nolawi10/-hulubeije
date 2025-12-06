const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hulubeije.pythonanywhere.com'
  : 'http://localhost:5000';

export async function apiHealthCheck() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) throw new Error('API health check failed');
  return response.json();
}
