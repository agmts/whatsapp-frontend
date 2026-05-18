import { createElement as h, useState, useEffect } from 'react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://web-production-0a1b2.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return h('div', {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0F1419',
      position: 'relative',
    },
  },
    h('div', {
      style: {
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 80% 80%, #8B7355 0%, transparent 50%)',
        pointerEvents: 'none',
      },
    }),

    h('div', {
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: '28rem',
        padding: '2rem',
        backgroundColor: '#1A1F2E',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      },
    },
      h('div', { style: { marginBottom: '2rem', textAlign: 'center' } },
        h('div', {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            marginBottom: '1rem',
          },
        },
          h('div', {
            style: {
              width: '1.5rem',
              height: '1.5rem',
              backgroundColor: '#D4AF37',
              borderRadius: '50%',
            },
          })
        ),
        h('h1', {
          style: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#E8E4DF',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0',
          },
        }, 'WhatsApp Dashboard'),
        h('p', {
          style: {
            fontSize: '0.875rem',
            color: '#A8A39E',
            margin: '0',
          },
        }, 'Premium Monitoring & Management')
      ),

      h('form', { onSubmit: handleLogin, style: { display: 'flex', flexDirection: 'column', gap: '1rem' } },
        h('div', null,
          h('label', {
            style: {
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#E8E4DF',
              marginBottom: '0.5rem',
            },
          }, 'Username'),
          h('input', {
            type: 'text',
            value: username,
            onChange: (e: any) => setUsername(e.target.value),
            placeholder: 'Enter username',
            disabled: loading,
            style: {
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1A1F2E',
              border: '1px solid #2A3142',
              borderRadius: '0.375rem',
              color: '#E8E4DF',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
            },
          })
        ),

        h('div', null,
          h('label', {
            style: {
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#E8E4DF',
              marginBottom: '0.5rem',
            },
          }, 'Password'),
          h('input', {
            type: 'password',
            value: password,
            onChange: (e: any) => setPassword(e.target.value),
            placeholder: 'Enter password',
            disabled: loading,
            autoComplete: 'current-password',
            style: {
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1A1F2E',
              border: '1px solid #2A3142',
              borderRadius: '0.375rem',
              color: '#E8E4DF',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
            },
          })
        ),

        error && h('div', {
          style: {
            padding: '0.75rem',
            backgroundColor: '#8B3A3A',
            borderRadius: '0.375rem',
            color: '#FFB3B3',
            fontSize: '0.875rem',
            textAlign: 'center',
          },
        }, error),

        h('button', {
          type: 'submit',
          disabled: loading,
          onMouseEnter: (e: any) => {
            if (!loading) {
              e.target.style.backgroundColor = '#C9A961';
            }
          },
          onMouseLeave: (e: any) => {
            if (!loading) {
              e.target.style.backgroundColor = '#D4AF37';
            }
          },
          style: {
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#D4AF37',
            color: '#0F1419',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 200ms ease-out',
          },
        }, loading ? 'Logging in...' : 'Login')
      ),

      h('p', {
        style: {
          fontSize: '0.75rem',
          color: '#A8A39E',
          textAlign: 'center',
          marginTop: '1.5rem',
          margin: '1.5rem 0 0 0',
        },
      }, 'Use: admin / CamelDelvey')
    )
  );
}
