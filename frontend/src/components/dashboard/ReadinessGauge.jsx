// src/components/ReadinessGauge.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Zap } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider.jsx";

export default function ReadinessGauge() {
  const { palette } = useTheme();
  const readinessScore = 78;

  // Dynamic color mappings based on palette
  const paletteColors = {
    aurora: {
      cardGradient: "linear-gradient(135deg, hsl(280 100% 65%), hsl(295 100% 75%))"
    },
    sunset: {
      cardGradient: "linear-gradient(135deg, hsl(15 100% 65%), hsl(25 100% 75%))"
    },
    ocean: {
      cardGradient: "linear-gradient(135deg, hsl(200 100% 60%), hsl(210 100% 70%))"
    },
    forest: {
      cardGradient: "linear-gradient(135deg, hsl(140 80% 55%), hsl(150 80% 65%))"
    },
    cosmic: {
      cardGradient: "linear-gradient(135deg, hsl(260 100% 70%), hsl(280 100% 80%))"
    }
  };

  const currentColors = paletteColors[palette] || paletteColors.aurora;

  const factors = [
    { name: "Technical Skills", score: 85, color: "text-success" },
    { name: "Communication", score: 72, color: "text-warning" },
    { name: "Problem Solving", score: 89, color: "text-primary" },
    { name: "Industry Knowledge", score: 65, color: "text-destructive" },
  ];

  return (
    <Card className="bg-gradient-glass border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Placement Readiness
        </CardTitle>
        <CardDescription>
          AI-powered assessment of your job readiness
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="hsl(var(--border))"
                strokeWidth="8"
                fill="none"
                className="opacity-20"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${readinessScore * 3.14} 314`}
                strokeLinecap="round"
                className="drop-shadow-glow"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {readinessScore}%
              </span>
              <span className="text-xs text-muted-foreground">Ready</span>
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <TrendingUp className="w-3 h-3 mr-1" />
              Good Progress
            </Badge>
            <p className="text-sm text-muted-foreground">
              You're on track for placement season!
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Skills Breakdown</h4>
          {factors.map((factor) => (
            <div key={factor.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{factor.name}</span>
                <span className={`text-sm font-semibold ${factor.color}`}>
                  {factor.score}%
                </span>
              </div>
              <Progress value={factor.score} className="h-2" />
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="p-4 bg-gradient-glass rounded-lg border border-primary/10">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: currentColors.cardGradient }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Next Recommendation</p>
              <p className="text-xs text-muted-foreground">
                Complete System Design course
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
