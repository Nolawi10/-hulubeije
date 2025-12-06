const API_BASE_URL = '';

export const api = {
  async health() {
    const response = await fetch('/api/health');
    return response.json();
  },

  async status() {
    const response = await fetch('/api/status');
    return response.json();
  },

  async chatWithGemini(message: string, history: any[] = []) {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history
      })
    });
    return response.json();
  },

  async generateCaption(imageData: string, prompt?: string) {
    const response = await fetch('/api/gemini/caption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        prompt: prompt || 'Generate a catchy social media caption for this image'
      })
    });
    return response.json();
  },

  async generatePoster(businessType: string, product: string, theme?: string) {
    const response = await fetch('/api/gemini/poster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_type: businessType,
        product: product,
        theme: theme || 'modern'
      })
    });
    return response.json();
  },

  async searchPlaces(query: string, location?: string) {
    const response = await fetch('/api/maps/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        location: location || '9.1450,40.4893' // Addis Ababa
      })
    });
    return response.json();
  },

  async getDirections(origin: string, destination: string) {
    const response = await fetch('/api/maps/directions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin,
        destination
      })
    });
    return response.json();
  }
};
