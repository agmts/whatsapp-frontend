/**
 * API Client for WhatsApp Monitoring Dashboard
 * Handles authentication and communication with backend API
 */

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';

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
      console.log('Attempting login to:', `${API_BASE_URL}/token`);
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

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Login successful, token received');
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }

    return response.json();
  }

  async getHistory(senderId: string): Promise<ConversationDetail> {
    const response = await fetch(`${API_BASE_URL}/api/history/${senderId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    return response.json();
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
