import React, { useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { ArrowRight, Lock, User, Sparkles, Mail, UserPlus, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

export default function SignInSignUp() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        result = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      } else {
        result = await login(formData.email, formData.password);
      }

      if (result.success) {
        toast({
          title: "Success",
          description: isSignUp ? "Account created successfully!" : "Welcome back!",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      role: 'student'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 font-sans">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden border-primary/20 backdrop-blur-md">
        <CardHeader className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <Sparkles className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {isSignUp ? 'Join RecruitXchange' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {isSignUp 
              ? 'Create your account to get started with your placement journey.'
              : 'Sign in to access your placement dashboard.'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loginRole">Login as</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select login type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Student
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required={isSignUp}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-11 border-border focus:border-primary/50"
                    />
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@university.edu"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-11 border-border focus:border-primary/50"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 h-11 border-border focus:border-primary/50"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required={isSignUp}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 h-11 border-border focus:border-primary/50"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            {!isSignUp && (
              <a href="#" className="text-primary hover:underline font-medium block mb-2">
                Forgot Password?
              </a>
            )}
            <p className="text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button"
                onClick={toggleMode}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}