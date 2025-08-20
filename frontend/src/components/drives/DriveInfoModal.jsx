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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Building,
  Users,
  GraduationCap,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';

const DriveInfoModal = ({ isOpen, onClose, driveId }) => {
  const [driveData, setDriveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { API_BASE_URL } = useAuth();

  useEffect(() => {
    if (isOpen && driveId) {
      fetchDriveInfo();
    }
  }, [isOpen, driveId]);

  const fetchDriveInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/drives/${driveId}`);
      if (response.ok) {
        const data = await response.json();
        setDriveData(data);
      }
    } catch (error) {
      console.error('Error fetching drive info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!driveData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
                {driveData.logo || '🏢'}
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold">{driveData.company}</DialogTitle>
                <DialogDescription className="text-xl">{driveData.role}</DialogDescription>
                {driveData.featured && (
                  <Badge className="mt-2 bg-gradient-to-r from-primary to-accent text-white">
                    ⭐ Featured Drive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{driveData.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-bold text-primary">{driveData.package}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Deadline: {new Date(driveData.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{driveData.applicants} applicants</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {driveData.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  About the Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{driveData.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Technical Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {driveData.requirements?.map((req, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {req}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eligibility */}
          {driveData.eligibility && driveData.eligibility.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {driveData.eligibility.map((criteria, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Process Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Selection Process & Schedule
              </CardTitle>
              <CardDescription>
                Complete timeline of the recruitment process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driveData.processSchedule && driveData.processSchedule.length > 0 ? (
                  driveData.processSchedule.map((stage, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{stage.stage}</h4>
                            <p className="text-sm text-muted-foreground">{stage.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-11 grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(stage.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{stage.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{stage.venue}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback to basic process list if no schedule is available
                  driveData.process?.map((stage, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <span className="font-medium">{stage}</span>
                      {index < driveData.process.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
              Apply for this Drive
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriveInfoModal;