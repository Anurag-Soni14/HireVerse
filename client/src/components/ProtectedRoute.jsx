import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the appropriate dashboard if wrong role
    return (
      <Navigate
        to={user?.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard'}
        replace
      />
    );
  }

  return <>{children}</>;
};
