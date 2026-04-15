import { config } from '../config/env.js';

const SB_URL = config.supabase.url;
const SB_KEY = config.supabase.anonKey;

class ApiClient {
  constructor() {
    this.baseUrl = SB_URL;
    this.headers = {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  async request(table, method = 'GET', body = null, query = '') {
    const url = `${this.baseUrl}/rest/v1/${table}${query}`;
    const options = {
      method,
      headers: this.headers
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      if (method === 'DELETE') {
        return { success: true };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  get(table, query = '') {
    return this.request(table, 'GET', null, query);
  }

  post(table, body, query = '') {
    return this.request(table, 'POST', body, query);
  }

  patch(table, body, query = '') {
    return this.request(table, 'PATCH', body, query);
  }

  delete(table, query = '') {
    return this.request(table, 'DELETE', null, query);
  }
}

export const api = new ApiClient();
