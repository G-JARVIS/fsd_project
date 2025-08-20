// src/components/QuickActions.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Code,
  Users,
  Calendar,
  FileText,
  Star,
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider.jsx";

export default function QuickActions() {
  const { palette } = useTheme();

  // Dynamic color mappings based on palette
  const paletteColors = {
    aurora: {
      primary: "hsl(280 100% 65%)",
      accent: "hsl(295 100% 75%)",
      cardGradient: "linear-gradient(135deg, hsl(280 100% 65%), hsl(295 100% 75%))",
      accentGradient: "linear-gradient(135deg, hsl(295 100% 75%), hsl(280 100% 65%))"
    },
    sunset: {
      primary: "hsl(15 100% 65%)",
      accent: "hsl(25 100% 75%)",
      cardGradient: "linear-gradient(135deg, hsl(15 100% 65%), hsl(25 100% 75%))",
      accentGradient: "linear-gradient(135deg, hsl(25 100% 75%), hsl(15 100% 65%))"
    },
    ocean: {
      primary: "hsl(200 100% 60%)",
      accent: "hsl(210 100% 70%)",
      cardGradient: "linear-gradient(135deg, hsl(200 100% 60%), hsl(210 100% 70%))",
      accentGradient: "linear-gradient(135deg, hsl(210 100% 70%), hsl(200 100% 60%))"
    },
    forest: {
      primary: "hsl(140 80% 55%)",
      accent: "hsl(150 80% 65%)",
      cardGradient: "linear-gradient(135deg, hsl(140 80% 55%), hsl(150 80% 65%))",
      accentGradient: "linear-gradient(135deg, hsl(150 80% 65%), hsl(140 80% 55%))"
    },
    cosmic: {
      primary: "hsl(260 100% 70%)",
      accent: "hsl(280 100% 80%)",
      cardGradient: "linear-gradient(135deg, hsl(260 100% 70%), hsl(280 100% 80%))",
      accentGradient: "linear-gradient(135deg, hsl(280 100% 80%), hsl(260 100% 70%))"
    }
  };

  const currentColors = paletteColors[palette] || paletteColors.aurora;

  const actions = [
    {
      title: "Start Learning",
      description: "Continue your recommended path",
      icon: BookOpen,
      color: "primary",
      action: "Continue React Course",
    },
    {
      title: "Practice Coding",
      description: "Solve problems and improve",
      icon: Code,
      color: "success",
      action: "Daily Challenge",
    },
    {
      title: "Browse Drives",
      description: "Find opportunities",
      icon: Users,
      color: "accent",
      action: "12 New Drives",
    },
    {
      title: "Schedule Session",
      description: "Book counseling",
      icon: Calendar,
      color: "warning",
      action: "Available Today",
    },
    {
      title: "Update Resume",
      description: "Keep your profile fresh",
      icon: FileText,
      color: "muted",
      action: "Last updated 2w ago",
    },
    {
      title: "Skill Assessment",
      description: "Test your knowledge",
      icon: Star,
      color: "destructive",
      action: "Take Quiz",
    },
  ];

  return (
    <Card className="bg-gradient-glass border-primary/20">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Jump into your most important tasks
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <div
              key={action.title}
              className="group p-4 rounded-xl bg-gradient-glass border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glass cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                  style={{
                    background: action.color === "primary"
                      ? currentColors.cardGradient
                      : action.color === "success"
                      ? (palette === "forest" ? currentColors.cardGradient : "hsl(var(--success))")
                      : action.color === "accent"
                      ? currentColors.accentGradient
                      : action.color === "warning"
                      ? (palette === "sunset" ? currentColors.cardGradient : "hsl(var(--warning))")
                      : action.color === "destructive"
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--muted))"
                  }}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {action.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">
                      {action.action}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button 
            variant="gradient" 
            className="flex-1"
            style={{ background: currentColors.cardGradient }}
          >
            View All Actions
          </Button>
          <Button variant="outline" className="flex-1 border-primary/30 text-primary hover:bg-primary/10">
            Customize Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
