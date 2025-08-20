import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Calendar, Clock, Video, MessageCircle, User, Star, CheckCircle, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

export default function Counseling() {
  const [counselors, setCounselors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user, getAuthHeaders, API_BASE_URL } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCounselors();
    fetchSessions();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/counseling/counselors`);
      if (response.ok) {
        const data = await response.json();
        setCounselors(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch counselors:', error);
      // Fallback to mock data
      setCounselors([
        {
          _id: "1",
          name: "Dr. Rajesh Kumar",
          role: "Career Counselor",
          profile: {
            experience: "15+ years",
            specialties: ["Technical Interviews", "Career Planning", "Resume Review"],
            sessionsCompleted: 1200
          },
          rating: 4.9,
          available: true
        }
      ]);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/counseling/sessions`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookSession = async (counselorId, type) => {
    try {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 2); // 2 days from now
      
      const response = await fetch(`${API_BASE_URL}/counseling/book`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          counselorId,
          type,
          scheduledDate,
          duration: 60,
          mode: 'Video Call'
        })
      });

      if (response.ok) {
        const newSession = await response.json();
        setSessions(prev => [newSession, ...prev]);
        toast({
          title: "Session Booked!",
          description: "Your counseling session has been scheduled successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Booking Failed",
          description: error.message || "Failed to book session",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to book session",
        variant: "destructive"
      });
    }
  };

  const upcomingSessions = sessions
    .filter(session => new Date(session.scheduledDate) > new Date())
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const quickServices = [
    {
      title: "Resume Review",
      description: "Get expert feedback on your resume and make it stand out",
      icon: "📄",
      duration: "30 min",
      price: "Free",
      popular: true,
    },
    {
      title: "Mock Interview",
      description: "Practice with real interview scenarios and get feedback",
      icon: "🎯",
      duration: "45 min",
      price: "₹299",
      popular: true,
    },
    {
      title: "Career Planning",
      description: "Plan your career path with personalized expert guidance",
      icon: "🗺️",
      duration: "60 min",
      price: "₹499",
      popular: false,
    },
    {
      title: "Skill Assessment",
      description: "Identify your strengths and areas for improvement",
      icon: "📊",
      duration: "30 min",
      price: "Free",
      popular: false,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
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
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Career Counseling</h1>
              <p className="text-lg text-white/90 mt-1">
                Expert guidance • 1-on-1 sessions • Proven results
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              size="lg"
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Session
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 transition-all"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Quick Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: User, value: `${counselors.length}+`, label: "Expert Counselors", gradient: "from-primary to-primary/80" },
          { icon: Star, value: "4.8/5", label: "Avg Rating", gradient: "from-warning to-warning/80" },
          { icon: CheckCircle, value: "10K+", label: "Sessions Completed", gradient: "from-success to-success/80" },
          { icon: TrendingUp, value: "95%", label: "Success Rate", gradient: "from-accent to-accent/80" },
        ].map((stat, index) => (
          <Card 
            key={index}
            className="group bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your scheduled counseling sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSessions.map((session, index) => (
              <div
                key={session._id}
                className="group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Video className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                      {session.type}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">with {session.counselorId?.name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-lg">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.scheduledDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" />
                        {new Date(session.scheduledDate).toLocaleTimeString()}
                      </span>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button className="bg-gradient-to-r from-primary to-accent" size="sm">
                    Join Call
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Services */}
      <Card className="bg-gradient-glass border-accent/20 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            Quick Services
          </CardTitle>
          <CardDescription>Get instant help with common career needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickServices.map((service, index) => (
              <div
                key={index}
                className="group relative p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:shadow-accent/10 text-center overflow-hidden"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                {service.popular && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-white border-0 text-[10px]">
                    Popular
                  </Badge>
                )}
                <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110">
                  {service.icon}
                </div>
                <h4 className="font-bold text-base mb-2 group-hover:text-accent transition-colors">
                  {service.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.duration}
                  </span>
                  <Badge
                    variant={service.price === "Free" ? "secondary" : "default"}
                    className={service.price === "Free" ? "bg-success/10 text-success border-success/20" : ""}
                  >
                    {service.price}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-accent/5 group-hover:border-accent/30 transition-all"
                  size="sm"
                  onClick={() => bookSession(counselors[0]?._id, service.title)}
                >
                  Book Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Counselors */}
      <Card className="bg-gradient-glass border-success/20 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-success/20 to-primary/20 rounded-lg">
              <User className="w-5 h-5 text-success" />
            </div>
            Available Counselors
          </CardTitle>
          <CardDescription>Connect with expert counselors for personalized guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor, index) => (
              <div
                key={counselor._id}
                className="group p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-success/30 transition-all duration-500 hover:shadow-lg hover:shadow-success/10"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="text-center mb-5">
                  <div className="text-6xl mb-3 transition-transform duration-500 group-hover:scale-110">
                    {counselor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="font-bold text-lg group-hover:text-success transition-colors">
                    {counselor.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">{counselor.role}</p>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm font-semibold">{counselor.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({(counselor.profile?.sessionsCompleted || 0)}+ sessions)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {counselor.profile?.experience}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {counselor.profile?.specialties?.map((specialty) => (
                        <Badge 
                          key={specialty} 
                          variant="outline" 
                          className="text-xs px-2 py-0.5 bg-muted/30"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Next Available</p>
                    <p className={`text-sm font-semibold ${counselor.available ? 'text-success' : 'text-muted-foreground'}`}>
                      {counselor.available ? "Today 3:00 PM" : "Next Week"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={counselor.available ? "default" : "outline"}
                      className={counselor.available ? "flex-1 bg-gradient-to-r from-success to-success/80" : "flex-1"}
                      size="sm"
                      disabled={!counselor.available}
                      onClick={() => bookSession(counselor._id, "Career Counseling")}
                    >
                      {counselor.available ? "Book Session" : "Unavailable"}
                    </Button>
                    <Button variant="outline" size="sm">
                      Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}