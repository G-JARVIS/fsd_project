// Debug utilities for session management
import { SESSION_KEYS, getSessionData, isSessionExpired } from './sessionUtils.js';

export const debugSession = () => {
  const token = getSessionData(SESSION_KEYS.TOKEN);
  const user = getSessionData(SESSION_KEYS.USER);
  const lastActivity = localStorage.getItem(SESSION_KEYS.LAST_ACTIVITY);
  const expired = isSessionExpired();
  
  console.group('🔍 Session Debug Info');
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'None');
  console.log('User data:', user ? { name: user.name, email: user.email } : 'None');
  console.log('Last activity:', lastActivity ? new Date(parseInt(lastActivity)) : 'None');
  console.log('Session expired:', expired);
  console.log('Local storage keys:', Object.keys(localStorage));
  console.groupEnd();
  
  return {
    hasToken: !!token,
    hasUser: !!user,
    lastActivity: lastActivity ? new Date(parseInt(lastActivity)) : null,
    isExpired: expired
  };
};

// Add to window for easy debugging
if (typeof window !== 'undefined') {
  window.debugSession = debugSession;
}