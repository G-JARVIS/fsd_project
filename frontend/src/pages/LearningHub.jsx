import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Search, BookOpen, Play, Clock, Star, Users, Award, TrendingUp, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

export default function LearningHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { getAuthHeaders, API_BASE_URL } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    fetchUserProgress();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive"
      });
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning/progress`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId, progress, completed = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning/progress/${courseId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ progress, completed })
      });

      if (response.ok) {
        const updatedProgress = await response.json();
        setUserProgress(prev => 
          prev.filter(p => p.courseId?._id !== courseId).concat([updatedProgress])
        );
        toast({
          title: "Progress Updated",
          description: `Your progress has been saved`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    }
  };

  const getCourseProgress = (courseId) => {
    const progress = userProgress.find(p => p.courseId?._id === courseId);
    return progress || { progress: 0, completed: false };
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getLevelColor = (level) => {
    const colors = {
      Beginner: "bg-success/10 text-success border-success/20",
      Intermediate: "bg-warning/10 text-warning border-warning/20",
      Advanced: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return colors[level] || "";
  };

  const inProgressCourses = courses.filter(course => {
    const progress = getCourseProgress(course._id);
    return progress.progress > 0 && !progress.completed;
  });

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
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Learning Hub</h1>
              <p className="text-lg text-white/90 mt-1">
                Master in-demand skills • Expert instructors • Lifetime access
              </p>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="flex gap-3 max-w-3xl mt-6">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-white/70 z-10" />
                <Input
                  placeholder="Search courses, topics, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-2xl text-base"
                />
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="h-14 px-6 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-2xl"
            >
              Browse All Courses
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, value: `${courses.length}+`, label: "Courses", gradient: "from-primary to-primary/80" },
          { icon: Users, value: courses.reduce((sum, course) => sum + course.students, 0), label: "Students", gradient: "from-success to-success/80" },
          { icon: Award, value: `${userProgress.filter(p => p.completed).length}`, label: "Completed", gradient: "from-accent to-accent/80" },
          { icon: Star, value: "4.8", label: "Avg Rating", gradient: "from-warning to-warning/80" },
        ].map((stat, index) => (
          <Card 
            key={index}
            className="group bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning Section */}
      {inProgressCourses.length > 0 && (
        <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                <Play className="w-5 h-5 text-primary" />
              </div>
              Continue Learning
            </CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressCourses.map((course) => {
                const progress = getCourseProgress(course._id);
                return (
                  <div 
                    key={course._id} 
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="text-5xl">{course.thumbnail}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress value={progress.progress} className="flex-1 h-2" />
                          <span className="text-xs font-semibold text-primary">{progress.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-accent"
                      onClick={() => updateProgress(course._id, Math.min(progress.progress + 10, 100))}
                    >
                      Continue
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Courses */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{filteredCourses.length} Courses Available</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? `Filtered by "${searchQuery}"` : "Explore our complete catalog"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const progress = getCourseProgress(course._id);
            return (
              <Card 
                key={course._id} 
                className="group bg-gradient-glass border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-6 space-y-4 relative">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="text-5xl transition-transform duration-500 group-hover:scale-110">
                      {course.thumbnail}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge 
                        variant={course.price === "Free" ? "secondary" : "default"} 
                        className={course.price === "Free" ? "bg-success/10 text-success border-success/20" : "bg-gradient-to-r from-primary to-accent text-white border-0"}
                      >
                        {course.price}
                      </Badge>
                      {progress.progress > 0 && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {progress.progress}% Done
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <span className="font-medium">{course.instructor}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <Badge variant="outline" className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pb-3 border-b border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-medium">{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="font-medium">{course.modules} modules</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant={progress.progress > 0 ? "default" : "default"}
                      className={progress.progress > 0 ? "flex-1 bg-gradient-to-r from-primary to-accent" : "flex-1 bg-gradient-to-r from-primary to-accent"}
                      size="sm"
                      onClick={() => {
                        if (progress.progress > 0) {
                          updateProgress(course._id, Math.min(progress.progress + 10, 100));
                        } else {
                          updateProgress(course._id, 10);
                        }
                      }}
                    >
                      {progress.progress > 0 ? (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Continue
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-1" />
                          Start Course
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-primary/5">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}