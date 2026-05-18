import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

// Force rebuild to pick up VITE_API_URL environment variable
export default function Login() {
  const [location, setLocation] = useLocation();
  console.log('Login component mounted, current location:', location);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Handle redirect after login
  useEffect(() => {
    if (shouldRedirect) {
      console.log('useEffect: shouldRedirect is true, calling setLocation');
      setLocation('/dashboard');
    }
  }, [shouldRedirect, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login handler called');

    try {
      console.log('Calling apiClient.login...');
      const result = await apiClient.login(username, password);
      console.log('Login successful, token:', result.access_token);
      console.log('Token stored in localStorage:', localStorage.getItem('dashboard_token'));
      toast.success('Login successful');
      console.log('About to redirect to /dashboard');
      // Set flag to trigger redirect in useEffect
      console.log('Setting shouldRedirect to true');
      setShouldRedirect(true);
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', (error as any).message);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663667368776/SqoDoUNN9bWGvZBfLwNt4u/dashboard-hero-Rdk3qfjL34ZeG2DaYGP8qc.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      <Card className="relative w-full max-w-md p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">WhatsApp Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage conversations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Use: admin / CamelDelvey
        </p>
      </Card>
    </div>
  );
}
