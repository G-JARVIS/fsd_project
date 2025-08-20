import React from 'react';
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { ArrowRight, Lock, User, Sparkles } from "lucide-react";

/**
 * LoginPage Component (Show-only)
 * @param {function} onLogin - Callback function to call upon successful login attempt.
 */
export default function LoginPage({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 💡 SHOW-ONLY LOGIC: Instantly calls the onLogin prop to transition to the main app.
    // We don't need to check credentials or handle loading/errors for now.
    onLogin(); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 font-sans">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden border-primary/20 backdrop-blur-md">
        <CardHeader className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <Sparkles className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to RecruitXchange
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your placement dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-border focus:border-primary/50"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-border focus:border-primary/50"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
             <a href="#" className="text-primary hover:underline font-medium">
               Forgot Password?
             </a>
             <p className="text-muted-foreground mt-2">
               Don't have an account? <a href="#" className="text-primary hover:underline">Sign Up</a>
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
