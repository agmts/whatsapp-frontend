import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export default function Login() {
  const [location, setLocation] = useLocation();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (shouldRedirect) {
      setLocation('/dashboard');
    }
  }, [shouldRedirect, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await apiClient.login(username, password);
      toast.success('Login successful');
      setShouldRedirect(true);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0F1419',
      position: 'relative',
    }}>
      {/* Subtle gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 80% 80%, #8B7355 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '28rem',
        padding: '2rem',
        backgroundColor: '#1A1F2E',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            marginBottom: '1rem',
          }}>
            <div style={{
              width: '1.5rem',
              height: '1.5rem',
              backgroundColor: '#D4AF37',
              borderRadius: '50%',
            }} />
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#E8E4DF',
            marginBottom: '0.5rem',
          }}>WhatsApp Dashboard</h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#A8A39E',
          }}>Premium Monitoring & Management</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#E8E4DF',
              marginBottom: '0.5rem',
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1A1F2E',
                border: '1px solid #2A3142',
                borderRadius: '0.375rem',
                color: '#E8E4DF',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#E8E4DF',
              marginBottom: '0.5rem',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1A1F2E',
                border: '1px solid #2A3142',
                borderRadius: '0.375rem',
                color: '#E8E4DF',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
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
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#C9A961';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#D4AF37';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{
          fontSize: '0.75rem',
          color: '#A8A39E',
          textAlign: 'center',
          marginTop: '1.5rem',
        }}>
          Use: admin / CamelDelvey
        </p>
      </div>
    </div>
  );
}
