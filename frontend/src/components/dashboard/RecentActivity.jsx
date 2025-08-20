import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  BookOpen,
  Code,
  Award,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useTheme } from "@/providers/ThemeProvider.jsx";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
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
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/recent-activity`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivities(data || []);
      } else {
        // Fallback to mock data
        setActivities([
          {
            id: 1,
            type: "course_completed",
            title: "Completed React Hooks Mastery",
            description: "Advanced hooks and performance optimization",
            timestamp: "2 hours ago",
            points: "+50 XP",
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      // Fallback to mock data
      setActivities([
        {
          id: 1,
          type: "course_completed",
          title: "Completed React Hooks Mastery",
          description: "Advanced hooks and performance optimization",
          timestamp: "2 hours ago",
          points: "+50 XP",
        },
        {
          id: 2,
          type: "practice_session",
          title: "Solved 5 coding problems",
          description: "Dynamic programming challenges",
          timestamp: "5 hours ago",
          points: "+25 XP",
        },
        {
          id: 3,
          type: "skill_assessment",
          title: "JavaScript Assessment - Passed",
          description: "Scored 92% in advanced concepts",
          timestamp: "1 day ago",
          points: "+100 XP",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      course_completed: CheckCircle,
      practice_session: Code,
      skill_assessment: Award,
      learning_path: BookOpen,
      skill_improvement: TrendingUp,
      application: CheckCircle
    };
    return icons[type] || CheckCircle;
  };

  const getActivityColor = (type) => {
    const colors = {
      course_completed: "success",
      practice_session: "primary", 
      skill_assessment: "accent",
      learning_path: "warning",
      skill_improvement: "primary",
      application: "success"
    };
    return colors[type] || "success";
  };

  if (loading) {
    return (
      <Card className="bg-gradient-glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Loading your learning journey...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-4 p-3 rounded-lg bg-gradient-glass border border-border/50 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-glass border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your learning journey this week</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {activities.reduce((sum, activity) => {
              const points = parseInt(activity.points) || 0;
              return sum + points;
            }, 0)} XP earned
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            const getColorStyle = (color) => {
              switch (color) {
                case 'primary':
                  return { background: currentColors.primary };
                case 'accent':
                  return { background: currentColors.accent };
                case 'success':
                  return { background: palette === 'forest' ? currentColors.primary : 'hsl(var(--success))' };
                case 'warning':
                  return { background: palette === 'sunset' ? currentColors.primary : 'hsl(var(--warning))' };
                default:
                  return { background: currentColors.primary };
              }
            };

            return (
              <div
                key={activity.id || activity._id}
                className="flex items-start gap-4 p-3 rounded-lg bg-gradient-glass border border-border/50 hover:border-primary/30 transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                  style={getColorStyle(color)}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{activity.title}</h4>
                    <span className="text-xs font-medium text-primary">
                      {activity.points}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {activity.description}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}