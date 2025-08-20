// Session management utilities

export const SESSION_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LAST_ACTIVITY: 'lastActivity'
};

export const setSessionData = (key, data) => {
  try {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
    localStorage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString());
  } catch (error) {
    console.error('Failed to set session data:', error);
  }
};

export const getSessionData = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  } catch (error) {
    console.error('Failed to get session data:', error);
    return null;
  }
};

export const clearSessionData = () => {
  try {
    Object.values(SESSION_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear session data:', error);
  }
};

export const isSessionExpired = () => {
  const lastActivity = localStorage.getItem(SESSION_KEYS.LAST_ACTIVITY);
  if (!lastActivity) {
    // If no last activity recorded, set it to now and don't expire
    updateLastActivity();
    return false;
  }
  
  const now = Date.now();
  const lastActivityTime = parseInt(lastActivity);
  const maxInactivity = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  
  const isExpired = (now - lastActivityTime) > maxInactivity;
  console.log('Session expiry check:', {
    lastActivity: new Date(lastActivityTime),
    now: new Date(now),
    isExpired,
    daysSinceActivity: (now - lastActivityTime) / (24 * 60 * 60 * 1000)
  });
  
  return isExpired;
};

export const updateLastActivity = () => {
  localStorage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString());
};

// Auto-update activity on user interactions
const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click'];

let activityTimeout;
let isTrackingActive = false;

const throttleActivity = () => {
  clearTimeout(activityTimeout);
  activityTimeout = setTimeout(() => {
    updateLastActivity();
    console.log('Activity updated:', new Date());
  }, 5000); // Throttle to once per 5 seconds
};

// Initialize activity tracking
export const initActivityTracking = () => {
  if (isTrackingActive) return; // Prevent duplicate listeners
  
  console.log('Initializing activity tracking');
  isTrackingActive = true;
  updateLastActivity(); // Set initial activity
  
  activityEvents.forEach(event => {
    document.addEventListener(event, throttleActivity, true);
  });
};

// Cleanup activity tracking
export const cleanupActivityTracking = () => {
  if (!isTrackingActive) return;
  
  console.log('Cleaning up activity tracking');
  isTrackingActive = false;
  
  activityEvents.forEach(event => {
    document.removeEventListener(event, throttleActivity, true);
  });
  clearTimeout(activityTimeout);
};