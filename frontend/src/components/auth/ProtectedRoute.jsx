import React from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import SignInSignUp from '@/pages/SignInSignUp.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInSignUp />;
  }

  return children;
};

export default ProtectedRoute;