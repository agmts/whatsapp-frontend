import { createElement as h, useState, useEffect } from 'react';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://web-production-0a1b2.up.railway.app/api/conversations', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://web-production-0a1b2.up.railway.app/api/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: messageInput }),
      });
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return h('div', {
      style: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F1419',
        color: '#E8E4DF',
      },
    }, 'Loading conversations...');
  }

  return h('div', {
    style: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0F1419',
    },
  },
    // Left Panel
    h('div', {
      style: {
        width: '300px',
        borderRight: '1px solid #2A3142',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1A1F2E',
      },
    },
      h('div', {
        style: {
          padding: '1rem',
          borderBottom: '1px solid #2A3142',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      },
        h('h1', {
          style: {
            margin: '0',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#E8E4DF',
          },
        }, 'Conversations'),
        h('button', {
          onClick: onLogout,
          style: {
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#A89968',
            cursor: 'pointer',
            fontSize: '0.875rem',
          },
        }, 'Logout')
      ),
      h('div', {
        style: {
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem',
        },
      },
        conversations.length === 0
          ? h('div', {
              style: {
                textAlign: 'center',
                padding: '2rem',
                color: '#A89968',
              },
            }, 'No conversations')
          : conversations.map((conv: any) =>
              h('button', {
                key: conv.id,
                onClick: () => setSelectedConversation(conv),
                style: {
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: selectedConversation?.id === conv.id ? '#D4AF37' : 'transparent',
                  border: '1px solid #2A3142',
                  borderRadius: '0.375rem',
                  color: selectedConversation?.id === conv.id ? '#0F1419' : '#E8E4DF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                },
              },
                h('div', {
                  style: {
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  },
                }, conv.sender_id),
                h('div', {
                  style: {
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginTop: '0.25rem',
                  },
                }, conv.last_message || 'No messages')
              )
            )
      )
    ),

    // Right Panel
    h('div', {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0F1419',
      },
    },
      selectedConversation
        ? h('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
            // Header
            h('div', {
              style: {
                padding: '1rem',
                borderBottom: '1px solid #2A3142',
                backgroundColor: '#1A1F2E',
              },
            },
              h('h2', {
                style: {
                  margin: '0',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#E8E4DF',
                },
              }, selectedConversation.sender_id)
            ),

            // Messages
            h('div', {
              style: {
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              },
            },
              selectedConversation.messages && selectedConversation.messages.length > 0
                ? selectedConversation.messages.map((msg: any, idx: number) =>
                    h('div', {
                      key: idx,
                      style: {
                        display: 'flex',
                        justifyContent: msg.message_type === 'human' ? 'flex-end' : 'flex-start',
                      },
                    },
                      h('div', {
                        style: {
                          maxWidth: '70%',
                          padding: '0.75rem',
                          backgroundColor: msg.message_type === 'human' ? '#D4AF37' : '#2A3142',
                          color: msg.message_type === 'human' ? '#0F1419' : '#E8E4DF',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                        },
                      }, msg.content)
                    )
                  )
                : h('div', {
                    style: {
                      textAlign: 'center',
                      color: '#A89968',
                      padding: '2rem',
                    },
                  }, 'No messages yet')
            ),

            // Input
            h('form', {
              onSubmit: handleSendMessage,
              style: {
                padding: '1rem',
                borderTop: '1px solid #2A3142',
                backgroundColor: '#1A1F2E',
                display: 'flex',
                gap: '0.5rem',
              },
            },
              h('input', {
                type: 'text',
                value: messageInput,
                onChange: (e: any) => setMessageInput(e.target.value),
                placeholder: 'Type a message...',
                disabled: sending,
                style: {
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#0F1419',
                  border: '1px solid #2A3142',
                  borderRadius: '0.375rem',
                  color: '#E8E4DF',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                },
              }),
              h('button', {
                type: 'submit',
                disabled: sending || !messageInput.trim(),
                style: {
                  padding: '0.75rem 1rem',
                  backgroundColor: '#D4AF37',
                  color: '#0F1419',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1,
                },
              }, 'Send')
            )
          )
        : h('div', {
            style: {
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A89968',
              fontSize: '1rem',
            },
          }, 'Select a conversation to view messages')
    )
  );
}
