import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, GraduationCap, Award, Briefcase, FileText, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast.js";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`http://localhost:5001/api/admin/students/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);
        setApplications(data.applications);
      } else {
        throw new Error('Failed to fetch student data');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch student data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Student not found</p>
          <Button onClick={() => navigate('/admin/students')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/students')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Student Profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span>{student.email}</span>
                </div>
                
                {student.profile?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span>{student.profile.phone}</span>
                  </div>
                )}
                
                {student.profile?.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Location:</span>
                    <span>{student.profile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Joined:</span>
                  <span>{new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.profile?.college && (
                  <div>
                    <span className="text-sm text-gray-600">College:</span>
                    <p className="font-medium">{student.profile.college}</p>
                  </div>
                )}
                
                {student.profile?.branch && (
                  <div>
                    <span className="text-sm text-gray-600">Branch:</span>
                    <Badge variant="secondary" className="ml-2">{student.profile.branch}</Badge>
                  </div>
                )}
                
                {student.profile?.yearOfStudy && (
                  <div>
                    <span className="text-sm text-gray-600">Year of Study:</span>
                    <p className="font-medium">{student.profile.yearOfStudy}</p>
                  </div>
                )}
                
                {student.profile?.cgpa && (
                  <div>
                    <span className="text-sm text-gray-600">CGPA:</span>
                    <p className="font-medium">{student.profile.cgpa}</p>
                  </div>
                )}
              </div>

              {student.profile?.bio && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm text-gray-600">Bio:</span>
                    <p className="mt-1">{student.profile.bio}</p>
                  </div>
                </>
              )}

              {student.profile?.resume && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Resume:</span>
                      <span className="font-medium">{student.profile.resume}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`http://localhost:5001/api/profile/resume/${student._id}`, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          {student.profile?.skills && student.profile.skills.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.profile.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {student.profile?.projects && student.profile.projects.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.profile.projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Readiness Score</span>
                <span className="font-semibold">{student.profile?.readinessScore || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level</span>
                <span className="font-semibold">{student.profile?.level || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">XP</span>
                <span className="font-semibold">{student.profile?.xp || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Drive Applications</CardTitle>
              <CardDescription>{applications.length} applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-gray-500 text-sm">No applications yet</p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application._id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">
                            {application.driveId?.company || 'Unknown Company'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {application.driveId?.role || 'Unknown Role'}
                          </p>
                        </div>
                        <Badge 
                          variant={application.status === 'selected' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {application.status}
                        </Badge>
                      </div>
                      {application.currentStage && (
                        <p className="text-xs text-gray-500 mt-1">
                          Stage: {application.currentStage}
                        </p>
                      )}
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{applications.length - 5} more applications
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}