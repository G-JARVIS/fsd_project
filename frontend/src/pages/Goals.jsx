import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Target, CheckCircle, Clock, Zap, TrendingUp, Sparkles, ArrowRight, Brain, BookOpen, Code, Trophy, Lock } from "lucide-react";

export default function Goals() {
  const [activeGoal, setActiveGoal] = useState("short-term");

  const roadmapData = {
    overall: {
      progress: 68,
      completedTasks: 24,
      totalTasks: 35,
      streakDays: 12,
      xpEarned: 2450,
    },
    milestones: [
      {
        id: 1,
        title: "Technical Foundation",
        status: "completed",
        completedDate: "Jan 15, 2024",
        tasks: 8,
        icon: BookOpen,
        color: "success",
      },
      {
        id: 2,
        title: "Advanced DSA Mastery",
        status: "in-progress",
        progress: 75,
        tasks: 12,
        icon: Code,
        color: "primary",
      },
      {
        id: 3,
        title: "System Design & Projects",
        status: "in-progress",
        progress: 40,
        tasks: 10,
        icon: Brain,
        color: "accent",
      },
      {
        id: 4,
        title: "Interview Preparation",
        status: "locked",
        unlockDate: "Feb 20, 2024",
        tasks: 5,
        icon: Trophy,
        color: "warning",
      },
    ],
    shortTermGoals: [
      {
        id: 1,
        title: "Complete Dynamic Programming Module",
        description: "Finish 15 DP problems on LeetCode and complete the Udemy course section",
        deadline: "Jan 25, 2024",
        priority: "high",
        progress: 80,
        tasks: [
          { name: "Solve Coin Change problem", completed: true },
          { name: "Complete Knapsack variants", completed: true },
          { name: "Practice LIS variations", completed: true },
          { name: "Solve Matrix Chain Multiplication", completed: false },
          { name: "Complete course quiz", completed: false },
        ],
        aiRecommendation: "Focus on optimization problems next. Your pattern recognition is strong!",
      },
      {
        id: 2,
        title: "Build Full-Stack Project",
        description: "Create a real-time chat application using MERN stack with WebSocket integration",
        deadline: "Feb 5, 2024",
        priority: "high",
        progress: 35,
        tasks: [
          { name: "Set up backend architecture", completed: true },
          { name: "Implement user authentication", completed: true },
          { name: "Create React frontend", completed: false },
          { name: "Integrate WebSocket", completed: false },
          { name: "Deploy on AWS", completed: false },
        ],
        aiRecommendation: "Great progress! Consider adding Redis for message caching.",
      },
      {
        id: 3,
        title: "Mock Interview Practice",
        description: "Complete 3 mock technical interviews with peers or counselors",
        deadline: "Jan 30, 2024",
        priority: "medium",
        progress: 33,
        tasks: [
          { name: "Schedule first mock interview", completed: true },
          { name: "Complete DSA mock round", completed: false },
          { name: "System design discussion", completed: false },
        ],
        aiRecommendation: "Schedule your next mock interview within 3 days for optimal preparation.",
      },
    ],
    longTermGoals: [
      {
        id: 1,
        title: "Land Offer at Top Tech Company",
        description: "Secure a software engineering position at FAANG or equivalent company",
        deadline: "May 2024",
        priority: "high",
        progress: 68,
        milestones: [
          { name: "Complete technical preparation", status: "in-progress", progress: 80 },
          { name: "Build 3 strong projects", status: "in-progress", progress: 67 },
          { name: "Get referrals from 5 companies", status: "pending", progress: 20 },
          { name: "Clear 10 company interviews", status: "pending", progress: 0 },
        ],
        aiRecommendation: "On track! Focus on getting company referrals in the next 2 weeks.",
      },
      {
        id: 2,
        title: "Achieve 5-Star Coder Rating",
        description: "Reach 5-star rating on CodeChef or Codeforces",
        deadline: "Apr 2024",
        priority: "medium",
        progress: 45,
        milestones: [
          { name: "Solve 300 problems", status: "in-progress", progress: 73 },
          { name: "Participate in 20 contests", status: "in-progress", progress: 40 },
          { name: "Achieve consistent rating", status: "pending", progress: 25 },
        ],
        aiRecommendation: "Increase contest participation. Focus on Div 2 rounds.",
      },
    ],
    aiInsights: [
      {
        type: "strength",
        title: "Strong Problem-Solving Pattern",
        description: "You excel at recursive problems and dynamic programming. Your solution approaches show mature algorithmic thinking.",
        icon: Zap,
      },
      {
        type: "improvement",
        title: "System Design Gap",
        description: "Consider dedicating more time to distributed systems concepts. This will be crucial for senior engineer roles.",
        icon: TrendingUp,
      },
      {
        type: "opportunity",
        title: "Open Source Contribution",
        description: "Your React skills are excellent. Contributing to popular open-source projects can boost your profile significantly.",
        icon: Sparkles,
      },
    ],
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-destructive/10 text-destructive border-destructive/20",
      medium: "bg-warning/10 text-warning border-warning/20",
      low: "bg-success/10 text-success border-success/20",
    };
    return colors[priority] || "";
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-success/10 text-success border-success/20",
      "in-progress": "bg-primary/10 text-primary border-primary/20",
      locked: "bg-muted text-muted-foreground border-muted",
      pending: "bg-warning/10 text-warning border-warning/20",
    };
    return colors[status] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/20 via-background to-muted/30">
      <div className="p-6 space-y-6">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Your Learning Roadmap</h1>
                <p className="text-lg text-white/90 mt-1">
                  AI-powered career path • Personalized goals • Track progress
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Overall Progress", value: `${roadmapData.overall.progress}%`, icon: TrendingUp },
                { label: "Tasks Completed", value: `${roadmapData.overall.completedTasks}/${roadmapData.overall.totalTasks}`, icon: CheckCircle },
                { label: "Day Streak", value: `${roadmapData.overall.streakDays} days`, icon: Zap },
                { label: "XP Earned", value: roadmapData.overall.xpEarned, icon: Trophy },
              ].map((stat, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4" />
                    <p className="text-xs font-medium text-white/80">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-glass border-accent/20 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              AI Career Insights
            </CardTitle>
            <CardDescription>Personalized recommendations based on your learning patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadmapData.aiInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-accent/30 transition-all duration-300">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Learning Milestones */}
        <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              Learning Milestones
            </CardTitle>
            <CardDescription>Major checkpoints in your placement journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roadmapData.milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isLocked = milestone.status === "locked";
                return (
                  <div 
                    key={milestone.id} 
                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                      isLocked 
                        ? "bg-muted/20 border-border/50" 
                        : "bg-gradient-to-br from-card/80 to-card/40 border-border/50 hover:border-primary/30 hover:shadow-lg"
                    }`}
                  >
                    <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ${
                      milestone.status === "completed" 
                        ? "bg-gradient-to-br from-success to-success/80" 
                        : milestone.status === "in-progress"
                        ? "bg-gradient-to-br from-primary to-primary/80"
                        : "bg-muted"
                    } shadow-lg`}>
                      {isLocked ? (
                        <Lock className="w-7 h-7 text-muted-foreground" />
                      ) : (
                        <Icon className="w-7 h-7 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{milestone.title}</h4>
                        <Badge variant="outline" className={getStatusColor(milestone.status)}>
                          {milestone.status === "in-progress" ? "In Progress" : milestone.status}
                        </Badge>
                      </div>
                      
                      {milestone.status === "completed" && (
                        <p className="text-sm text-muted-foreground">
                          ✓ Completed on {milestone.completedDate}
                        </p>
                      )}
                      
                      {milestone.status === "in-progress" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{milestone.tasks} tasks remaining</span>
                            <span className="font-semibold text-primary">{milestone.progress}%</span>
                          </div>
                          <Progress value={milestone.progress} className="h-2" />
                        </div>
                      )}
                      
                      {milestone.status === "locked" && (
                        <p className="text-sm text-muted-foreground">
                          Unlocks on {milestone.unlockDate}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Goal Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeGoal === "short-term" ? "default" : "outline"}
            onClick={() => setActiveGoal("short-term")}
            className={activeGoal === "short-term" ? "bg-gradient-to-r from-primary to-accent" : ""}
          >
            Short-Term Goals
          </Button>
          <Button
            variant={activeGoal === "long-term" ? "default" : "outline"}
            onClick={() => setActiveGoal("long-term")}
            className={activeGoal === "long-term" ? "bg-gradient-to-r from-primary to-accent" : ""}
          >
            Long-Term Goals
          </Button>
        </div>

        {/* Goals Content */}
        {activeGoal === "short-term" && (
          <div className="grid grid-cols-1 gap-6">
            {roadmapData.shortTermGoals.map((goal, index) => (
              <Card key={goal.id} className="bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{goal.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Deadline: {goal.deadline}
                        </span>
                        <span className="font-semibold text-primary">{goal.progress}% complete</span>
                      </div>
                    </div>
                  </div>

                  <Progress value={goal.progress} className="h-3 mb-4" />

                  <div className="space-y-2 mb-4">
                    {goal.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <CheckCircle className={`w-5 h-5 ${task.completed ? "text-success" : "text-muted-foreground"}`} />
                        <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-accent mb-1">AI Recommendation</p>
                        <p className="text-sm text-muted-foreground">{goal.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeGoal === "long-term" && (
          <div className="grid grid-cols-1 gap-6">
            {roadmapData.longTermGoals.map((goal, index) => (
              <Card key={goal.id} className="bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{goal.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Target: {goal.deadline}
                        </span>
                        <span className="font-semibold text-primary">{goal.progress}% complete</span>
                      </div>
                    </div>
                  </div>

                  <Progress value={goal.progress} className="h-3 mb-6" />

                  <div className="space-y-4 mb-4">
                    {goal.milestones.map((milestone, milestoneIndex) => (
                      <div key={milestoneIndex} className="p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{milestone.name}</span>
                          <Badge variant="outline" className={getStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{milestone.progress}% complete</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-accent mb-1">AI Recommendation</p>
                        <p className="text-sm text-muted-foreground">{goal.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}