/**
 * API Client for WhatsApp Monitoring Dashboard
 * Handles authentication and communication with backend API
 */

const API_BASE_URL = 'https://web-production-0a1b2.up.railway.app';

export interface Conversation {
  id: number;
  sender_id: string;
  takeover_state: boolean;
  last_message?: string;
  timestamp?: string;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  direction: 'inbound' | 'outbound';
  message_type: 'user' | 'bot' | 'human';
  timestamp: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

class APIClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('dashboard_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('dashboard_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('dashboard_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/token`, 'API_BASE_URL:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: username,
          message: password,
        }),
      });

      console.log('Response status:', response.status, 'URL was:', `${API_BASE_URL}/token`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Login successful! Token received from:', `${API_BASE_URL}/token`);
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      console.error('Login error from', `${API_BASE_URL}/token`, ':', error);
      throw error;
    }
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      console.log('getConversations: Fetching from', `${API_BASE_URL}/api/conversations`);
      const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      console.log('getConversations: Response status', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('getConversations: Error response', response.status, errorText);
        throw new Error(`Failed to fetch conversations: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('getConversations: Success, got', data.length, 'conversations');
      return data;
    } catch (error) {
      console.error('getConversations: Exception', error);
      throw error;
    }
  }

  async getHistory(senderId: string): Promise<ConversationDetail> {
    try {
      console.log('getHistory: Fetching for sender', senderId);
      const response = await fetch(`${API_BASE_URL}/api/history/${senderId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      console.log('getHistory: Response status', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('getHistory: Error response', response.status, errorText);
        throw new Error(`Failed to fetch history: ${response.status}`);
      }

      const data = await response.json();
      console.log('getHistory: Success');
      return data;
    } catch (error) {
      console.error('getHistory: Exception', error);
      throw error;
    }
  }

  async sendMessage(sender: string, message: string): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        sender,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async takeover(sender: string): Promise<{ status: string; takeover_state: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/takeover`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ sender }),
    });

    if (!response.ok) {
      throw new Error('Failed to takeover conversation');
    }

    return response.json();
  }

  async handback(sender: string): Promise<{ status: string; takeover_state: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/handback`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ sender }),
    });

    if (!response.ok) {
      throw new Error('Failed to handback conversation');
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
