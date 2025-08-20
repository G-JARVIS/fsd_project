import React from "react";
import { X, Home, BookOpen, Code, Users, TrendingUp, Settings, GraduationCap, Calendar, Sparkles, Target, FileText, Shield, UserCheck, Building2 } from "lucide-react";
import { GamepadIcon } from "lucide-react";  // Add to your existing imports
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";

const studentNavigation = [
  { name: "Dashboard", href: "/", icon: Home, badge: null },
  { name: "Role Explorer", href: "/roles", icon: TrendingUp, badge: "AI" },
  { name: "Learning Hub", href: "/learning", icon: BookOpen, badge: "24" },
  { name: "Practice Hub", href: "/practice", icon: Code, badge: "New" },
  { name: "Resume Builder", href: "/resume-builder", icon: FileText, badge: "AI" },
  { name: "Counseling", href: "/counseling", icon: GraduationCap, badge: null },
  { name: "My Drives", href: "/drives", icon: Users, badge: "12" },
  { name: "Calendar", href: "/calendar", icon: Calendar, badge: null },
  { name: "Method Invader", href: "/method-invader", icon: GamepadIcon, badge: "Fun" },
];

const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin", icon: Shield, badge: null },
  { name: "Manage Students", href: "/admin/students", icon: UserCheck, badge: null },
  { name: "Manage Quizzes", href: "/admin/quizzes", icon: BookOpen, badge: null },
  { name: "Company Drives", href: "/admin/drives", icon: Building2, badge: null },
  { name: "Counselling", href: "/admin/counselling", icon: Users, badge: null },
  { name: "Job Roles", href: "/admin/roles", icon: TrendingUp, badge: null },
];

export function Sidebar({ onClose }) {
  const location = useLocation();
  const { user } = useAuth();

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to calculate readiness percentage
  const getReadinessPercentage = () => {
    if (!user?.profile) return 0;
    
    // Calculate based on profile completeness and level
    let completeness = 0;
    const profile = user.profile;
    
    // Basic info (30%)
    if (profile.firstName && profile.lastName) completeness += 15;
    if (profile.email) completeness += 10;
    if (profile.phone) completeness += 5;
    
    // Academic info (25%)
    if (profile.college) completeness += 10;
    if (profile.course) completeness += 10;
    if (profile.year) completeness += 5;
    
    // Skills and experience (25%)
    if (profile.skills && profile.skills.length > 0) completeness += 15;
    if (profile.experience && profile.experience.length > 0) completeness += 10;
    
    // Level-based bonus (20%)
    const level = profile.level || 1;
    const levelBonus = Math.min(20, level * 2);
    completeness += levelBonus;
    
    return Math.min(100, Math.round(completeness));
  };

  // Helper function to get user's academic status
  const getAcademicStatus = () => {
    if (!user?.profile) return "Student";
    
    return (user.profile.yearOfStudy);
  };

  const readinessPercentage = getReadinessPercentage();
  const userLevel = user?.profile?.level || 1;
  
  // Get user name with fallback logic
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.profile?.firstName && user?.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    if (user?.profile?.firstName) return user.profile.firstName;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };
  
  const userName = getUserName();
  const userInitials = getUserInitials(userName);
  const academicStatus = getAcademicStatus();

  return (
    <aside className="flex h-full w-72 flex-col bg-card/60 backdrop-blur-2xl border-r border-border/50 shadow-2xl">
      {/* Premium Header with Gradient */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-lg opacity-50 rounded-xl" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              RecruitXchange
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
              Career Platform
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="lg:hidden hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* User Profile Card */}
      <div className="mx-4 mt-4 mb-2">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 backdrop-blur-xl">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30">
                    {userInitials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" title={userName}>
                    {userName}
                  </p>
                  <p className="text-xs text-muted-foreground">{academicStatus}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-primary">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-semibold">{readinessPercentage}% Profile Complete</span>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-2">
                  Level {userLevel}
                </Badge>
              </div>
            </>
          ) : (
            // Loading state
            <div className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="h-3 bg-muted rounded w-1/3"></div>
                <div className="h-5 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-4 py-2 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">
          {user?.role === 'admin' ? 'Admin Panel' : 'Main Menu'}
        </div>
        {(user?.role === 'admin' ? adminNavigation : studentNavigation).map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-primary/15 to-accent/10 text-primary shadow-lg shadow-primary/10 border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent"
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-r-full shadow-lg shadow-primary/50" />
              )}
              
              <Icon
                className={cn(
                  "mr-3 h-5 w-5 transition-all duration-300",
                  isActive
                    ? "text-primary drop-shadow-glow"
                    : "text-muted-foreground group-hover:text-primary group-hover:scale-110"
                )}
              />
              <span className="flex-1">{item.name}</span>
              
              {item.badge && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "ml-auto text-[10px] px-1.5 py-0 h-5",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              
              {isActive && (
                <div className="ml-2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings Section */}
      <div className="p-4 border-t border-border/50 bg-gradient-to-t from-muted/20 to-transparent">
        <Link
          to="/settings"
          className="group flex items-center rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent"
        >
          <Settings className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90 duration-500" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;