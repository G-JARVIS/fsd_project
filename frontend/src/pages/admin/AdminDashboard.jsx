import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Users, BookOpen, Building2, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      title: "Manage Students",
      description: "View and manage all registered students",
      icon: Users,
      path: "/admin/students",
      color: "bg-blue-500"
    },
    {
      title: "Practice Hub Quizzes",
      description: "Add, edit, and delete practice quizzes",
      icon: BookOpen,
      path: "/admin/quizzes",
      color: "bg-green-500"
    },
    {
      title: "Company Drives",
      description: "Manage company recruitment drives",
      icon: Building2,
      path: "/admin/drives",
      color: "bg-purple-500"
    },
    {
      title: "Counselling Sessions",
      description: "Create and manage counselling sessions",
      icon: Users,
      path: "/admin/counselling",
      color: "bg-teal-500"
    },
    {
      title: "Job Roles",
      description: "Manage informational job role descriptions",
      icon: BarChart3,
      path: "/admin/roles",
      color: "bg-indigo-500"
    },
    {
      title: "Analytics",
      description: "View platform statistics and reports",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your RecruitXchange platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.path)}>
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students</span>
                <span className="font-semibold">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Drives</span>
                <span className="font-semibold">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Quizzes</span>
                <span className="font-semibold">--</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <p>No recent activity</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">All systems operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}