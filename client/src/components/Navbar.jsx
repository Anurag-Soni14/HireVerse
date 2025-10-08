import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Briefcase className="h-6 w-6" />
            <span>HireVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-medium text-foreground">{user?.name}</span>
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleNavigation(
                      user?.role === 'candidate'
                        ? '/candidate/dashboard'
                        : '/recruiter/dashboard'
                    )
                  }
                >
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNavigation('/auth')}>
                  Login
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleNavigation('/auth?mode=signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground px-4 mb-2">
                  Welcome, <span className="font-medium text-foreground">{user?.name}</span>
                </p>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() =>
                    handleNavigation(
                      user?.role === 'candidate'
                        ? '/candidate/dashboard'
                        : '/recruiter/dashboard'
                    )
                  }
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation('/auth')}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  className="justify-start"
                  onClick={() => handleNavigation('/auth?mode=signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
