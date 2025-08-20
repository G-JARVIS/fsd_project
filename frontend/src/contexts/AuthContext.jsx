import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SESSION_KEYS, 
  setSessionData, 
  getSessionData, 
  clearSessionData, 
  isSessionExpired,
  initActivityTracking,
  cleanupActivityTracking
} from '@/utils/sessionUtils.js';
import { debugSession } from '@/utils/debugSession.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    // Check if user data exists in localStorage on initial load
    console.log('🚀 AuthProvider initializing...');
    debugSession();
    
    const storedUser = getSessionData(SESSION_KEYS.USER);
    const storedToken = getSessionData(SESSION_KEYS.TOKEN);
    
    if (storedUser && storedToken && !isSessionExpired()) {
      console.log('✅ Valid session found, restoring user');
      setUser(storedUser);
      setIsAuthenticated(true);
      initActivityTracking();
      // Immediately validate the stored session
      checkAuthStatus();
    } else {
      // Session expired or no stored data
      console.log('❌ No valid session found');
      if (storedUser || storedToken) {
        clearAuthData();
      }
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = getSessionData(SESSION_KEYS.TOKEN);
      if (token && !isSessionExpired()) {
        console.log('Checking auth status with token');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('Auth check successful');
          setIsAuthenticated(true);
          setUser(userData);
          // Update session with fresh user data
          setSessionData(SESSION_KEYS.USER, userData);
          if (!isAuthenticated) {
            initActivityTracking();
          }
        } else if (response.status === 401) {
          // Token is invalid, clear everything
          console.log('Token invalid, clearing auth data');
          clearAuthData();
        } else {
          // Other errors, don't clear auth data immediately
          console.warn('Auth check failed with status:', response.status);
        }
      } else {
        // No token found or session expired, ensure state is cleared
        console.log('No token or session expired, clearing auth data');
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only clear auth data if it's clearly an auth issue, not a network issue
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        clearAuthData();
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = useCallback(() => {
    clearSessionData();
    setIsAuthenticated(false);
    setUser(null);
    cleanupActivityTracking();
  }, []);

  // Periodic session validation - less frequent to avoid network issues
  useEffect(() => {
    if (!isAuthenticated) return;

    const validateSession = async () => {
      try {
        const token = getSessionData(SESSION_KEYS.TOKEN);
        if (!token || isSessionExpired()) {
          console.log('Session expired or no token, logging out');
          clearAuthData();
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/validate`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.log('Session validation failed, logging out');
          clearAuthData();
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        // Don't automatically logout on network errors - only on auth failures
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          clearAuthData();
        }
      }
    };

    // Validate session every 30 minutes instead of 5 minutes
    const interval = setInterval(validateSession, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, API_BASE_URL, clearAuthData]);

  // Handle page visibility change to revalidate session - less aggressive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        // Only check if it's been more than 5 minutes since last check
        const lastActivity = getSessionData(SESSION_KEYS.LAST_ACTIVITY);
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (!lastActivity || (now - parseInt(lastActivity)) > fiveMinutes) {
          console.log('Page became visible, checking auth status');
          checkAuthStatus();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, setting session data');
        setSessionData(SESSION_KEYS.TOKEN, data.token);
        setSessionData(SESSION_KEYS.USER, data);
        setIsAuthenticated(true);
        setUser(data);
        initActivityTracking();
        return { success: true };
      } else {
        const error = await response.json().catch(() => ({ message: 'Server error' }));
        console.error('Login failed:', error);
        return { success: false, message: error.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, message: `Network error: ${error.message}` };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionData(SESSION_KEYS.TOKEN, data.token);
        setSessionData(SESSION_KEYS.USER, data);
        setIsAuthenticated(true);
        setUser(data);
        initActivityTracking();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      const token = getSessionData(SESSION_KEYS.TOKEN);
      if (token) {
        // Call backend logout endpoint
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear local data regardless of backend response
      clearAuthData();
    }
  };

  const getAuthHeaders = () => {
    const token = getSessionData(SESSION_KEYS.TOKEN);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Enhanced API call wrapper with automatic token validation
  const authenticatedFetch = async (url, options = {}) => {
    const token = getSessionData(SESSION_KEYS.TOKEN);
    
    if (!token || isSessionExpired()) {
      clearAuthData();
      throw new Error('No authentication token found or session expired');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // If token is invalid, clear auth data
    if (response.status === 401) {
      clearAuthData();
      throw new Error('Authentication expired');
    }

    return response;
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    signup,
    loading,
    API_BASE_URL,
    getAuthHeaders,
    authenticatedFetch,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};