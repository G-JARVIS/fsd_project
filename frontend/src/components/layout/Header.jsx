import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Search, User, MessageSquare, Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  const userName = user?.name || 'User';
  const userEmail = user?.email || 'user@example.com';
  return (
    <header className="sticky top-0 z-30 h-20 border-b border-border/50 bg-card/60 backdrop-blur-2xl px-4 lg:px-8 shadow-sm">
      <div className="flex h-full items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-primary/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Premium Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                placeholder="Search courses, roles, companies, practice problems..."
                className="pl-12 pr-4 h-12 bg-background/80 border-border/50 rounded-xl focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-sm"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 h-8 px-3 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                <Zap className="w-3 h-3 mr-1" />
                AI Search
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Messages */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10 transition-colors h-11 w-11 rounded-xl"
          >
            <MessageSquare className="w-5 h-5" />
            <Badge
              variant="default"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-success border-2 border-card"
            >
              2
            </Badge>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10 transition-colors h-11 w-11 rounded-xl"
          >
            <Bell className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-destructive/30 animate-pulse"
            >
              3
            </Badge>
          </Button>

          {/* Divider */}
          <div className="w-px h-8 bg-border/50 mx-2" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-11 px-3 rounded-xl hover:bg-primary/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/30 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-primary/50">
                    <AvatarImage src="/placeholder.svg" alt={userName} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold leading-none">{userName}</p>
                    {/* <p className="text-xs text-muted-foreground mt-0.5">
                      Level 12 • 87% Ready
                    </p> */}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-2xl p-2"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                    <AvatarImage src="/placeholder.svg" alt={userName} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-none">{userName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 p-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <Zap className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">Placement Readiness</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[87%] bg-gradient-to-r from-primary to-accent rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-primary">87%</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-border/50 my-2" />
              
              <DropdownMenuItem 
                onClick={handleViewProfile}
                className="rounded-lg py-2.5 px-3 cursor-pointer"
              >
                <User className="w-4 h-4 mr-3 text-muted-foreground" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg py-2.5 px-3 cursor-pointer">
                <MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />
                Resume Builder
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg py-2.5 px-3 cursor-pointer">
                <Bell className="w-4 h-4 mr-3 text-muted-foreground" />
                My Applications
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-border/50 my-2" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="rounded-lg py-2.5 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;