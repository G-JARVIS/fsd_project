import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';

import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  FileText
} from 'lucide-react';

const ApplicationStatusModal = ({ isOpen, onClose, applicationId }) => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authenticatedFetch, API_BASE_URL } = useAuth();

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchApplicationStatus();
    }
  }, [isOpen, applicationId]);

  const fetchApplicationStatus = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/applications/status/${applicationId}`);
      if (response.ok) {
        const data = await response.json();
        setStatusData(data);
      }
    } catch (error) {
      console.error('Error fetching application status:', error);
    } finally {
      setLoading(false);
    }
  };



  const getStatusBadgeVariant = (status) => {
    const variants = {
      applied: 'default',
      shortlisted: 'secondary',
      interview: 'outline',
      selected: 'default',
      rejected: 'destructive'
    };
    return variants[status] || 'outline';
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!statusData) {
    return null;
  }

  const { application, drive } = statusData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                {drive.logo || '🏢'}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">{drive.company}</DialogTitle>
                <DialogDescription className="text-lg">{drive.role}</DialogDescription>
              </div>
            </div>
            <Badge variant={getStatusBadgeVariant(application.status)} className="text-sm px-3 py-1">
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{drive.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{drive.package}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Application Progress
              </CardTitle>
              <CardDescription>
                Applied on {new Date(application.appliedDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.status === 'rejected' ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <p className="font-medium text-destructive">Application Rejected</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sorry you didn't clear the {application.currentStage || 'Your application was not selected for this position.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{application.progress || 0}%</span>
                    </div>
                    <Progress value={application.progress || 0} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div>
                      <p className="font-medium text-primary">Current Stage</p>
                      <p className="text-sm text-muted-foreground">{application.currentStage || 'Application Submitted'}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-primary">Next Step</p>
                      <p className="text-sm text-muted-foreground">{application.nextStep || 'Waiting for review'}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Process Timeline - Hide for rejected applications */}
          {application.status !== 'rejected' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Selection Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drive.processSchedule && drive.processSchedule.length > 0 ? (
                  drive.processSchedule.map((scheduleItem, index) => {
                    const currentStageIndex = application.processStageIndex || 0;
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const isUpcoming = index > currentStageIndex;

                    return (
                      <div key={index} className={`border rounded-lg p-4 transition-colors ${
                        isCurrent ? 'border-primary/30 bg-primary/5' : 
                        isCompleted ? 'border-green-500/30 bg-green-50/50' : 
                        'border-border hover:bg-muted/30'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                              isCompleted 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : isCurrent 
                                  ? 'bg-primary border-primary text-white' 
                                  : 'border-muted-foreground text-muted-foreground bg-background'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <h4 className={`font-semibold text-lg ${
                                isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-foreground'
                              }`}>
                                {scheduleItem.stage}
                              </h4>
                              <p className="text-sm text-muted-foreground">{scheduleItem.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {isCompleted && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Completed
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                In Progress
                              </Badge>
                            )}
                            {isUpcoming && (
                              <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                                Upcoming
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Schedule Details */}
                        <div className="ml-11 grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className={isCurrent ? 'font-medium text-primary' : ''}>{new Date(scheduleItem.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className={isCurrent ? 'font-medium text-primary' : ''}>{scheduleItem.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className={isCurrent ? 'font-medium text-primary' : ''}>{scheduleItem.venue}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback to basic process list when no schedule is available
                  drive.process.map((stage, index) => {
                    const currentStageIndex = application.processStageIndex || 0;
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const isUpcoming = index > currentStageIndex;

                    return (
                      <div key={index} className={`border rounded-lg p-4 transition-colors ${
                        isCurrent ? 'border-primary/30 bg-primary/5' : 
                        isCompleted ? 'border-green-500/30 bg-green-50/50' : 
                        'border-border hover:bg-muted/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                              isCompleted 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : isCurrent 
                                  ? 'bg-primary border-primary text-white' 
                                  : 'border-muted-foreground text-muted-foreground bg-background'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <h4 className={`font-semibold text-lg ${
                                isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-foreground'
                              }`}>
                                {stage}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {isCurrent && 'Current stage'}
                                {isCompleted && 'Completed'}
                                {isUpcoming && 'Upcoming stage'}
                              </p>
                            </div>
                          </div>
                          <div>
                            {isCompleted && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Completed
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                In Progress
                              </Badge>
                            )}
                            {isUpcoming && (
                              <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                                Upcoming
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Note about schedule */}
                        <div className="ml-11 mt-2 text-xs text-muted-foreground">
                          Schedule details will be shared closer to the date
                        </div>
                      </div>
                    );
                  })
                )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Updates Timeline */}
          {application.updates && application.updates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.updates.map((update, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">{update.stage}</p>
                        <p className="text-sm text-muted-foreground">{update.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(update.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
            {application.status === 'applied' && (
              <Button variant="outline" className="flex-1">
                Withdraw Application
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationStatusModal;