import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Home, ArrowLeft, Search, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background pointer-events-none" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '10s', animationDelay: '2s' }} />

      <div className="relative max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-50" />
          <div className="relative text-[150px] md:text-[200px] font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            404
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Page Not Found
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
          </p>

          {/* Path Info */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50 max-w-md mx-auto">
            <p className="text-xs text-muted-foreground mb-1">Attempted path:</p>
            <code className="text-sm font-mono text-destructive break-all">
              {location.pathname}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.4s' }}>
          <Link to="/">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 animate-in fade-in duration-700" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-muted-foreground mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { to: "/roles", label: "Role Explorer" },
              { to: "/learning", label: "Learning Hub" },
              { to: "/practice", label: "Practice Hub" },
              { to: "/drives", label: "My Drives" },
            ].map((link) => (
              <Link key={link.to} to={link.to}>
                <Button variant="ghost" size="sm" className="hover:bg-primary/5">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;