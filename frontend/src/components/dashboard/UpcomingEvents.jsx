import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Calendar, Clock, MapPin, Users, Video, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useTheme } from "@/providers/ThemeProvider.jsx";

export function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { getAuthHeaders, API_BASE_URL } = useAuth();
  const { palette } = useTheme();

  // Dynamic color mappings based on palette
  const paletteColors = {
    aurora: {
      primary: "linear-gradient(135deg, hsl(280 100% 65%), hsl(295 100% 75%))",
      accent: "linear-gradient(135deg, hsl(295 100% 75%), hsl(280 100% 65%))"
    },
    sunset: {
      primary: "linear-gradient(135deg, hsl(15 100% 65%), hsl(25 100% 75%))",
      accent: "linear-gradient(135deg, hsl(25 100% 75%), hsl(15 100% 65%))"
    },
    ocean: {
      primary: "linear-gradient(135deg, hsl(200 100% 60%), hsl(210 100% 70%))",
      accent: "linear-gradient(135deg, hsl(210 100% 70%), hsl(200 100% 60%))"
    },
    forest: {
      primary: "linear-gradient(135deg, hsl(140 80% 55%), hsl(150 80% 65%))",
      accent: "linear-gradient(135deg, hsl(150 80% 65%), hsl(140 80% 55%))"
    },
    cosmic: {
      primary: "linear-gradient(135deg, hsl(260 100% 70%), hsl(280 100% 80%))",
      accent: "linear-gradient(135deg, hsl(280 100% 80%), hsl(260 100% 70%))"
    }
  };

  const currentColors = paletteColors[palette] || paletteColors.aurora;

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/upcoming-events`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data || []);
      } else {
        // Fallback to mock data
        setEvents([
          {
            _id: "1",
            title: "Google Summer Internship Drive",
            type: "Placement Drive",
            date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            time: "10:00 AM",
            location: "Online Assessment",
            status: "registered",
            attendees: 245,
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
      // Fallback to mock data
      setEvents([
        {
          _id: "1",
          title: "Google Summer Internship Drive",
          type: "Placement Drive", 
          date: new Date(Date.now() + 86400000).toISOString(),
          time: "10:00 AM",
          location: "Online Assessment",
          status: "registered",
          attendees: 245,
        },
        {
          _id: "2", 
          title: "Career Counseling Session",
          type: "Counseling",
          date: new Date(Date.now() + 2 * 86400000).toISOString(),
          time: "2:00 PM", 
          location: "Video Call",
          status: "confirmed",
          attendees: 1,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      registered: "bg-primary/10 text-primary border-primary/20",
      confirmed: "bg-success/10 text-success border-success/20",
      pending: "bg-warning/10 text-warning border-warning/20",
      scheduled: "bg-accent/10 text-accent border-accent/20",
    };
    return styles[status] || "";
  };

  const getEventIcon = (type) => {
    const icons = {
      "Placement Drive": Users,
      "Counseling": Video,
      "Workshop": Users,
      "Interview": Phone,
      "Webinar": Video
    };
    return icons[type] || Calendar;
  };

  const getEventColor = (type) => {
    const colors = {
      "Placement Drive": "primary",
      "Counseling": "success",
      "Workshop": "warning", 
      "Interview": "accent",
      "Webinar": "destructive"
    };
    return colors[type] || "primary";
  };

  if (loading) {
    return (
      <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                Upcoming Events
              </CardTitle>
              <CardDescription className="mt-1">
                Loading your schedule...
              </CardDescription>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              ...
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 animate-pulse">
              <div className="w-14 h-14 rounded-xl bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Upcoming Events
            </CardTitle>
            <CardDescription className="mt-1">
              Your schedule for the next 7 days
            </CardDescription>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 px-3 py-1"
          >
            {events.length} events
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {events.map((event, index) => {
          const Icon = getEventIcon(event.type);
          const color = getEventColor(event.type);
          
          const getColorStyle = (color) => {
            switch (color) {
              case 'primary':
                return { background: currentColors.primary };
              case 'accent':
                return { background: currentColors.accent };
              case 'success':
                return { background: palette === 'forest' ? currentColors.primary : 'linear-gradient(135deg, hsl(var(--success)), hsl(var(--success) / 0.8))' };
              case 'warning':
                return { background: palette === 'sunset' ? currentColors.primary : 'linear-gradient(135deg, hsl(var(--warning)), hsl(var(--warning) / 0.8))' };
              case 'destructive':
                return { background: 'linear-gradient(135deg, hsl(var(--destructive)), hsl(var(--destructive) / 0.8))' };
              default:
                return { background: currentColors.primary };
            }
          };

          return (
            <div
              key={event._id}
              className="group relative"
              style={{ 
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` 
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                {/* Icon with Premium Styling */}
                <div className="relative">
                  <div
                    className="absolute inset-0 blur-xl opacity-40 rounded-xl"
                    style={getColorStyle(color)}
                  />
                  <div
                    className="relative w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                    style={getColorStyle(color)}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {event.type}
                        {event.attendees > 1 && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <span>{event.attendees} attending</span>
                          </>
                        )}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold px-2 py-1 ${getStatusBadge(event.status)}`}
                    >
                      {event.status}
                    </Badge>
                  </div>

                  {/* Event Meta Information */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg max-w-[180px] truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-medium truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-border/50 flex gap-3">
          <Button 
            variant="default" 
            className="flex-1 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            style={{ background: currentColors.primary }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Full Calendar
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
          >
            Add New Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default UpcomingEvents;