import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { ArrowLeft, Search, ArrowRight, X, User, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast.js";

export default function DriveApplications() {
  const [applications, setApplications] = useState([]);
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const { authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { driveId } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
    fetchDriveDetails();
  }, [driveId]);

  const fetchDriveDetails = async () => {
    try {
      const response = await authenticatedFetch(`http://localhost:5001/api/admin/drives`);
      if (response.ok) {
        const drives = await response.json();
        const currentDrive = drives.find(d => d._id === driveId);
        setDrive(currentDrive);
      }
    } catch (error) {
      console.error('Error fetching drive details:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`http://localhost:5001/api/admin/drives/${driveId}/applications`);
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToNextStage = async (applicationId) => {
    if (!confirm('Are you sure you want to move this application to the next stage?')) return;

    try {
      setActionLoading(prev => ({ ...prev, [applicationId]: 'next' }));
      
      const response = await authenticatedFetch(
        `http://localhost:5001/api/admin/applications/${applicationId}/next-stage`,
        {
          method: 'PUT'
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application moved to next stage successfully"
        });
        fetchApplications();
      } else {
        throw new Error('Failed to move application to next stage');
      }
    } catch (error) {
      console.error('Error moving to next stage:', error);
      toast({
        title: "Error",
        description: "Failed to move application to next stage",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [applicationId]: null }));
    }
  };

  const handleRejectApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to reject this application? This action cannot be undone.')) return;

    try {
      setActionLoading(prev => ({ ...prev, [applicationId]: 'reject' }));
      
      const response = await authenticatedFetch(
        `http://localhost:5001/api/admin/applications/${applicationId}/reject`,
        {
          method: 'PUT'
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application rejected successfully"
        });
        fetchApplications();
      } else {
        throw new Error('Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [applicationId]: null }));
    }
  };

  const filteredApplications = applications.filter(app =>
    app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'selected': return 'default';
      case 'rejected': return 'destructive';
      case 'interview': return 'secondary';
      case 'shortlisted': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/drives')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Drives
        </Button>
        
        <div className="flex items-center space-x-4 mb-4">
          <Building2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {drive?.company} - {drive?.role}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Drive Applications ({applications.length} total)
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Management</CardTitle>
          <CardDescription>
            View and update student application stages
          </CardDescription>
          
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Year of Study</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <User className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No applications found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application._id}>
                        <TableCell className="font-medium">
                          <button
                            onClick={() => navigate(`/admin/students/${application.userId?._id}`)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {application.userId?.name || 'Unknown'}
                          </button>
                        </TableCell>
                        <TableCell>
                          {application.userId?.profile?.branch ? (
                            <Badge variant="secondary">
                              {application.userId.profile.branch}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {application.userId?.profile?.yearOfStudy || (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {application.currentStage || 'Application Submitted'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Stage {application.processStageIndex || 0}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {application.status !== 'rejected' && application.status !== 'selected' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMoveToNextStage(application._id)}
                                disabled={actionLoading[application._id] === 'next'}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {actionLoading[application._id] === 'next' ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                ) : (
                                  <>
                                    <ArrowRight className="w-4 h-4 mr-1" />
                                    Next Stage
                                  </>
                                )}
                              </Button>
                            )}
                            {application.status !== 'rejected' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectApplication(application._id)}
                                disabled={actionLoading[application._id] === 'reject'}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {actionLoading[application._id] === 'reject' ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                ) : (
                                  <>
                                    <X className="w-4 h-4 mr-1" />
                                    Reject
                                  </>
                                )}
                              </Button>
                            )}
                            {(application.status === 'rejected' || application.status === 'selected') && (
                              <Badge variant="secondary" className="text-xs">
                                {application.status === 'rejected' ? 'Rejected' : 'Completed'}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}