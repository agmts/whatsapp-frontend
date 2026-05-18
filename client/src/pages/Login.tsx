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
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 80% 80%, #8B7355 0%, transparent 50%)',
      }} />

      <Card className="relative w-full max-w-md p-8 shadow-2xl border border-accent/20">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
            <div className="w-6 h-6 bg-accent rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">WhatsApp Dashboard</h1>
          <p className="text-sm text-muted-foreground">Premium Monitoring & Management</p>
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
            className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-semibold transition-all duration-200"
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
