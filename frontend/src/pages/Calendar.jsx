import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Calendar as CalendarIcon, Clock, Video, MapPin, Plus, Filter, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { EventModal } from "@/components/calendar/EventModal.jsx";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";

export default function Calendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, getAuthHeaders } = useAuth();
  const { events, isLoading, error, createEvent, deleteEvent, updateEvent } = useGoogleCalendar();

  const connectGoogle = async () => {
    try {
      const resp = await fetch(`${getAuthHeaders().Authorization ? `${process.env.VITE_API_URL || 'http://localhost:5001'}/api/google/url` : `${process.env.VITE_API_URL || 'http://localhost:5001'}/api/google/url`}`, {
        headers: getAuthHeaders()
      });
      const data = await resp.json();
      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      console.error('Failed to get Google auth URL', e);
    }
  };

  const handleCreateEvent = async (formData) => {
    // normalize dates to ISO
    const payload = {
      title: formData.title,
      description: formData.description,
      type: formData.type || 'Workshop',
      startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
      endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
      location: formData.location,
      addToGoogle: !!formData.addToGoogle,
    };

    try {
      await createEvent(payload);
      setIsModalOpen(false);
    } catch (e) {
      console.error('Create event failed', e);
    }
  };

  const colorMap = {
    "Placement Drive": "primary",
    "Workshop": "success", 
    "Interview": "accent",
    "Counseling": "warning",
    "Webinar": "destructive"
  };

  const getColorClass = (type) => {
    const color = colorMap[type] || "primary";
    const classes = {
      primary: "bg-primary",
      success: "bg-success", 
      accent: "bg-accent",
      warning: "bg-warning",
      destructive: "bg-destructive"
    };
    return classes[color];
  };

  const upcomingEvents = (events || [])
    .filter(event => new Date(event.startTime || event.date) >= today)
    .sort((a, b) => new Date(a.startTime || a.date) - new Date(b.startTime || b.date))
    .slice(0, 5);

  const todayEvents = (events || []).filter(event => {
    const eventDate = new Date(event.startTime || event.date);
    return eventDate.toDateString() === today.toDateString();
  });

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);

    return days;
  };

  const hasEvents = (day) => {
    if (!day) return false;
    const dayString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return (events || []).some(event => {
      const d = event.startTime || event.date || '';
      try {
        return new Date(d).toISOString().startsWith(dayString);
      } catch (e) {
        return String(d).startsWith(dayString);
      }
    });
  };

  const isToday = (day) => {
    if (!day) return false;
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  if (isLoading) {
    return (
      <>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        {/* Event Modal */}
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateEvent}
          initialData={{
            title: "",
            description: "",
            startTime: new Date().toISOString().slice(0,16),
            endTime: new Date(Date.now() + 3600000).toISOString().slice(0,16),
            location: "",
            addToGoogle: true
          }}
        />
      </>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Calendar</h1>
              <p className="text-lg text-white/90 mt-1">
                Stay organized • Never miss important events • Plan ahead
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              size="lg"
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Event
            </Button>
            {user?.google?.calendarConnected ? (
              <Button variant="outline" size="lg" className="border-success/20 text-success">
                Connected
              </Button>
            ) : (
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all" onClick={connectGoogle}>
                Connect Google
              </Button>
            )}
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 transition-all"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              Today's Events
            </CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayEvents.map((event, index) => (
              <div 
                key={event._id} 
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-primary/30 transition-all duration-300"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className={`w-2 h-12 rounded-full ${getColorClass(event.type)}`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-base mb-1">{event.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  {event.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-glass border-border/50 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map((day, idx) => (
                  <div
                    key={idx}
                    className={`relative p-4 text-center text-sm font-medium cursor-pointer rounded-xl transition-all duration-300
                      ${day ? 'hover:bg-primary/5 hover:shadow-md' : ''}
                      ${isToday(day) ? 'bg-gradient-to-br from-primary to-accent text-white font-bold shadow-lg' : ''}
                      ${hasEvents(day) && !isToday(day) ? 'bg-accent/10 border-2 border-accent/30 font-semibold' : ''}
                    `}
                    onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    {day && <>
                      <span className="relative z-10">{day}</span>
                      {hasEvents(day) && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                      )}
                    </>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="bg-gradient-glass border-accent/20 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <span>Upcoming</span>
              </CardTitle>
              <CardDescription>Next scheduled events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
                <div 
                  key={event._id} 
                  className="p-4 rounded-xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-accent/30 transition-all duration-300"
                  style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {event.type}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(event.startTime || event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] mt-2 bg-success/10 text-success border-success/20">
                    {event.status}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-glass border-success/20 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-success/20 to-primary/20 rounded-lg">
                  <Plus className="w-5 h-5 text-success" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start hover:bg-primary/5" size="sm">
                <Video className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-primary/5" size="sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Book Counseling
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-primary/5" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        initialData={{
          title: "",
          description: "",
          startTime: new Date().toISOString().slice(0,16),
          endTime: new Date(Date.now() + 3600000).toISOString().slice(0,16),
          location: "",
          addToGoogle: true
        }}
      />
    </div>
  );
}