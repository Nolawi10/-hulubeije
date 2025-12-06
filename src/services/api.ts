const API_BASE_URL = '';

export const api = {
  async health() {
    const response = await fetch('/api/health');
    return response.json();
  },

  async status() {
    const response = await fetch('/api/status');
    return response.json();
  }
};
