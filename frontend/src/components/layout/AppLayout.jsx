import { useState } from "react";
import { cn } from "@/lib/utils.js";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { ThemeProvider } from "@/providers/ThemeProvider.jsx";

export function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-500 relative overflow-hidden">
        {/* Premium Animated Background Layers */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_50%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.12),transparent_50%)] pointer-events-none" />
        
        {/* Subtle animated gradient orbs */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        <div className="relative flex h-screen">
          {/* Sidebar with Premium Styling */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Enhanced Overlay with Blur */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md lg:hidden transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-transparent via-background/50 to-background">
              <div className="h-full">
                {/* Content wrapper with subtle animation */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default AppLayout;