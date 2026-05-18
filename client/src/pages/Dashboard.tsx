import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { apiClient, Conversation, ConversationDetail, Message } from '@/lib/api';
import { toast } from 'sonner';
import { Send, LogOut, MessageCircle, User } from 'lucide-react';
import DashboardErrorBoundary from '@/components/DashboardErrorBoundary';

function DashboardContent() {
  const [, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetail | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const token = apiClient.getToken();
    console.log('Dashboard: Checking token, found:', !!token);
    console.log('Dashboard: localStorage token:', localStorage.getItem('dashboard_token'));
    if (!token) {
      console.log('Dashboard: No token found, but continuing anyway - will try to load conversations');
    } else {
      console.log('Dashboard: Token found, user is authenticated');
    }
  }, []);

  // Fetch conversations on mount and set up polling
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log('Fetching conversations...');
        const data = await apiClient.getConversations();
        console.log('Conversations fetched:', data);
        setConversations(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        console.error('Error details:', (error as any).message);
        setLoading(false);
        toast.error('Failed to load conversations. Check backend connection.');
      }
    };

    console.log('Dashboard mounted, fetching conversations...');
    fetchConversations();
    const interval = setInterval(fetchConversations, 4000); // Poll every 4 seconds

    return () => clearInterval(interval);
  }, [setLocation]);

  // Fetch conversation history when selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchHistory = async () => {
      try {
        const data = await apiClient.getHistory(selectedConversation.sender_id);
        setSelectedConversation(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [selectedConversation?.sender_id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    setSending(true);
    try {
      await apiClient.sendMessage(selectedConversation.sender_id, messageInput);
      setMessageInput('');
      toast.success('Message sent');
      
      // Refresh history
      const data = await apiClient.getHistory(selectedConversation.sender_id);
      setSelectedConversation(data);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleTakeover = async () => {
    if (!selectedConversation) return;

    try {
      await apiClient.takeover(selectedConversation.sender_id);
      setSelectedConversation({
        ...selectedConversation,
        takeover_state: true,
      });
      toast.success('Conversation taken over');
    } catch (error) {
      toast.error('Failed to takeover conversation');
      console.error(error);
    }
  };

  const handleHandback = async () => {
    if (!selectedConversation) return;

    try {
      await apiClient.handback(selectedConversation.sender_id);
      setSelectedConversation({
        ...selectedConversation,
        takeover_state: false,
      });
      toast.success('Conversation handed back to bot');
    } catch (error) {
      toast.error('Failed to handback conversation');
      console.error(error);
    }
  };

  const handleLogout = () => {
    apiClient.clearToken();
    setLocation('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading conversations...</p>
          <p className="text-xs text-muted-foreground mt-2">Check console for details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel: Conversations */}
      <div className="w-80 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Conversations</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv as ConversationDetail)}
                  className={`conversation-card w-full text-left ${
                    selectedConversation?.id === conv.id ? 'active' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{conv.sender_id}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {conv.last_message || 'No messages'}
                      </p>
                    </div>
                    <div className={`status-badge ml-2 flex-shrink-0 ${conv.takeover_state ? 'human' : 'active'}`}>
                      {conv.takeover_state ? 'Human' : 'Bot'}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel: Messages */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{selectedConversation.sender_id}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.takeover_state ? '🔴 Human Control' : '🟢 Bot Active'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedConversation.takeover_state ? (
                    <Button
                      onClick={handleHandback}
                      variant="outline"
                      size="sm"
                      className="text-secondary border-secondary hover:bg-secondary/10"
                    >
                      Hand Back to Bot
                    </Button>
                  ) : (
                    <Button
                      onClick={handleTakeover}
                      size="sm"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Take Over
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.message_type === 'human' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`message-bubble ${msg.message_type === 'human' ? 'human' : 'bot'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending || !selectedConversation.takeover_state}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={sending || !messageInput.trim() || !selectedConversation.takeover_state}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              {!selectedConversation.takeover_state && (
                <p className="text-xs text-muted-foreground mt-2">
                  Take over the conversation to send messages
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardErrorBoundary>
      <DashboardContent />
    </DashboardErrorBoundary>
  );
}
