import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import axios from 'axios';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, setUser } = useAuth();

  const [mode, setMode] = useState(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [role, setRole] = useState(searchParams.get('role') || 'candidate');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      navigate(user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (mode === 'login') {
        res = await axios.post(
          'http://localhost:5000/api/auth/login',
          { email: formData.email, password: formData.password, role },
          { withCredentials: true }
        );
        toast.success('Welcome back!');
      } else {
        if (!formData.name) {
          toast.error('Please enter your name');
          return;
        }
        res = await axios.post(
          'http://localhost:5000/api/auth/signup',
          { name: formData.name, email: formData.email, password: formData.password, role },
          { withCredentials: true }
        );
        toast.success('Account created successfully!');
      }

      const userData = res?.data;
      if (userData) {
        setUser(userData);
        localStorage.setItem('hireverse_user', JSON.stringify(userData));
      }

      navigate(role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard');
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl text-center">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {mode === 'login'
                  ? 'Sign in to your account to continue'
                  : 'Sign up to start your journey'}
              </CardDescription>

              {/* Role Selection */}
              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-smooth ${
                    role === 'candidate'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-smooth ${
                    role === 'recruiter'
                      ? 'bg-secondary text-secondary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  Recruiter
                </button>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={mode} onValueChange={(v) => setMode(v)}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant={role === 'recruiter' ? 'secondary' : 'default'}
                    size="lg"
                  >
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>
              </Tabs>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  {mode === 'login'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() =>
                      setMode(mode === 'login' ? 'signup' : 'login')
                    }
                    className="text-primary hover:underline font-medium"
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
