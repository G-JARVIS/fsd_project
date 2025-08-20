import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { initGoogleApi, signIn, createEvent, listEvents, deleteEvent, updateEvent } from '@/services/googleCalendar';
import { useAuth } from '@/contexts/AuthContext';

export function useGoogleCalendar() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const { API_BASE_URL, getAuthHeaders } = useAuth();
  const queryClient = useQueryClient();

  // Initialize Google API
  useEffect(() => {
    const init = async () => {
      try {
        await initGoogleApi();
        setIsInitialized(true);
      } catch (err) {
        setError('Failed to initialize Google Calendar API');
        console.error(err);
      }
    };
    init();
  }, []);

  // Fetch events from backend and optionally Google Calendar
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Fetch backend events first (always)
      const backendEventsResp = await fetch(`${API_BASE_URL}/events`, { headers: getAuthHeaders() });
      const backendJson = await backendEventsResp.json();
      const backendEvents = backendJson.events || [];

      let googleEvents = [];
      // If Google API initialized, try to fetch Google Calendar events (best-effort)
      if (isInitialized) {
        try {
          googleEvents = await listEvents(
            new Date(new Date().setMonth(new Date().getMonth() - 1)), // 1 month ago
            new Date(new Date().setMonth(new Date().getMonth() + 2))  // 2 months ahead
          );
        } catch (e) {
          console.warn('Failed to fetch Google events', e);
          googleEvents = [];
        }
      }

      // Merge and format events
      const formattedGoogleEvents = (googleEvents || []).map(event => ({
        id: event.id,
        _id: event.id,
        title: event.summary,
        description: event.description,
        startTime: event.start?.dateTime || event.start?.date,
        endTime: event.end?.dateTime || event.end?.date,
        location: event.location,
        source: 'google',
        attendees: event.attendees || [],
        // Format time from startDateTime for display
        time: event.start?.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All Day',
        // Add type and status for consistency with backend events
        type: 'External',
        status: 'Scheduled'
      }));

      const formattedBackendEvents = backendEvents.map(event => ({
        id: event._id,
        _id: event._id,
        title: event.title,
        description: event.description,
        // backend uses `date` and `time` fields
        startTime: event.startTime || event.date || event.date, // keep whatever exists
        endTime: event.endTime || null,
        location: event.location,
        source: 'backend',
        type: event.type,
        status: event.status,
        // Format time from startTime for display
        time: event.startTime 
          ? new Date(event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : 'All Day'
      }));

      return [...formattedBackendEvents, ...formattedGoogleEvents];
    },
    // always enabled (we handle google fetch internally)
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData) => {
      // Create in Google Calendar (client-side) if requested
      if (eventData.addToGoogle) {
        try {
          await signIn(); // Ensure user is signed in
          const googleEvent = await createEvent(eventData);
          eventData.googleEventId = googleEvent?.id;
        } catch (e) {
          // best-effort: continue to create backend event even if Google client fails
          console.warn('Google client create failed, will still create backend event', e);
        }
      }

      // Create in backend
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error('Failed to create event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async ({ eventId, source, googleEventId }) => {
      if (source === 'google' || googleEventId) {
        await signIn();
        await deleteEvent(googleEventId || eventId);
      }

      if (source === 'backend') {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error('Failed to delete event');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ eventId, source, googleEventId, updatedData }) => {
      if (source === 'google' || googleEventId) {
        await signIn();
        await updateEvent(googleEventId || eventId, updatedData);
      }

      if (source === 'backend') {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: 'PUT',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error('Failed to update event');
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  return {
    events,
    isLoading,
    error,
    // expose async variants so callers can await
    createEvent: createEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutateAsync,
    updateEvent: updateEventMutation.mutateAsync,
    isInitialized,
  };
}