import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import heroBackground from '@/assets/hero-background.jpg';

export default function Landing() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (isAuthenticated && user) {
      navigate(user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 z-0 gradient-hero opacity-90" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground animate-fade-in">
              Connect Talent with Opportunity
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 animate-fade-in">
              Join HireVerse - where the best talent meets the best opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate('/auth?role=candidate')}
                className="bg-card hover:bg-card/90 text-primary shadow-glow"
              >
                <Users className="mr-2 h-5 w-5" />
                I'm a Candidate
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate('/auth?role=recruiter')}
                className="bg-card hover:bg-card/90 text-secondary shadow-glow"
              >
                <Briefcase className="mr-2 h-5 w-5" />
                I'm a Recruiter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose HireVerse?</h2>
            <p className="text-xl text-muted-foreground">
              The platform built for modern hiring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="gradient-card border-border/50 hover:shadow-lg transition-smooth">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI-powered algorithms match candidates with perfect job opportunities
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50 hover:shadow-lg transition-smooth">
              <CardHeader>
                <Shield className="h-12 w-12 text-accent mb-2" />
                <CardTitle>Secure Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is protected with enterprise-grade security measures
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50 hover:shadow-lg transition-smooth">
              <CardHeader>
                <Users className="h-12 w-12 text-secondary mb-2" />
                <CardTitle>Verified Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with real professionals and legitimate companies
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50 hover:shadow-lg transition-smooth">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-success mb-2" />
                <CardTitle>Easy Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Apply to multiple jobs with one click using your profile
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="gradient-card border-primary/20 shadow-glow">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals and companies finding their perfect match on HireVerse
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate('/auth')}>
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
