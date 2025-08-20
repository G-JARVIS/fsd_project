const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let gapi = null;
let tokenClient = null;

// Initialize the Google API client
export const initGoogleApi = async () => {
  if (typeof window === 'undefined') return;
  
  // Load the Google API client library
  if (!gapi) {
    await loadScript('https://apis.google.com/js/api.js');
    gapi = window.gapi;
  }
  
  if (!gapi.client) {
    await new Promise((resolve) => gapi.load('client:auth2', resolve));
  }

  await gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    clientId: GOOGLE_CLIENT_ID,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    scope: 'https://www.googleapis.com/auth/calendar.events',
  });

  // Initialize the tokenClient
  if (!tokenClient) {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: '', // defined at request time
    });
  }
};

// Load external scripts
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

// Sign in and get user consent
export const signIn = () => {
  return new Promise((resolve, reject) => {
    tokenClient.callback = (response) => {
      if (response.error) reject(response);
      resolve(response);
    };
    tokenClient.requestAccessToken();
  });
};

// Create a new event in Google Calendar
export const createEvent = async (event) => {
  const response = await gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: event.startTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: event.endTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: event.location,
      attendees: event.attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    },
  });

  return response.result;
};

// Fetch events from Google Calendar
export const listEvents = async (timeMin, timeMax) => {
  const response = await gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.result.items;
};

// Delete an event from Google Calendar
export const deleteEvent = async (eventId) => {
  await gapi.client.calendar.events.delete({
    calendarId: 'primary',
    eventId: eventId,
  });
};

// Update an existing event in Google Calendar
export const updateEvent = async (eventId, updatedEvent) => {
  const response = await gapi.client.calendar.events.update({
    calendarId: 'primary',
    eventId: eventId,
    resource: {
      summary: updatedEvent.title,
      description: updatedEvent.description,
      start: {
        dateTime: updatedEvent.startTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: updatedEvent.endTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: updatedEvent.location,
      attendees: updatedEvent.attendees,
    },
  });

  return response.result;
};