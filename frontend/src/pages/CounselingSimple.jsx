import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog.jsx";
import { Calendar, Clock, User, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

export default function CounselingSimple() {
  const [sessions, setSessions] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [applicationData, setApplicationData] = useState({
    reason: '',
    urgency: 'medium',
    previousCounselling: false,
    notes: ''
  });

  const { authenticatedFetch } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
    fetchMyApplications();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await authenticatedFetch('http://localhost:5001/api/counseling/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await authenticatedFetch('http://localhost:5001/api/counseling/my-applications');
      if (response.ok) {
        const data = await response.json();
        setMyApplications(data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApplyForSession = async () => {
    if (!selectedSession || !applicationData.reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for counselling",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await authenticatedFetch(
        `http://localhost:5001/api/counseling/sessions/${selectedSession._id}/apply`,
        {
          method: 'POST',
          body: JSON.stringify(applicationData)
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application submitted successfully"
        });
        setIsDialogOpen(false);
        setApplicationData({ reason: '', urgency: 'medium', previousCounselling: false, notes: '' });
        fetchMyApplications();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to submit application",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error applying for session:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  const openApplicationDialog = (session) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'applied': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Career Counselling</h1>
            <p className="opacity-90">Get expert guidance for your career journey</p>
          </div>
        </div>
      </div>

      {/* My Applications */}
      {myApplications.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">My Counselling Applications</h2>
          <div className="grid gap-4">
            {myApplications.map((application) => (
              <Card key={application._id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{application.sessionId?.topic}</h3>
                      <p className="text-sm text-muted-foreground">
                        Counsellor: {application.sessionId?.counsellorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(application.sessionId?.date).toLocaleDateString()} at {application.sessionId?.time}
                      </p>
                      <p className="text-sm mt-2">Reason: {application.reason}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                      <Badge className={getUrgencyColor(application.urgency)}>
                        {application.urgency} priority
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Applied: {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Sessions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Available Counselling Sessions</h2>
        
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold mb-2">No sessions available</h3>
              <p className="text-muted-foreground">
                Please check back later or contact admin to schedule sessions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{session.topic}</h3>
                        <Badge variant="outline">{session.sessionType}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {session.counsellorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.time} ({session.duration} min)
                        </span>
                      </div>
                      
                      {session.description && (
                        <p className="text-muted-foreground mb-4">{session.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span>Location: {session.location}</span>
                        <span>Max participants: {session.maxParticipants}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={session.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {session.status}
                      </Badge>
                      
                      {session.status === 'scheduled' && (
                        <Button onClick={() => openApplicationDialog(session)}>
                          Apply for Session
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Counselling Session</DialogTitle>
            <DialogDescription>
              {selectedSession?.topic} with {selectedSession?.counsellorName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for Counselling *</label>
              <Textarea
                value={applicationData.reason}
                onChange={(e) => setApplicationData({...applicationData, reason: e.target.value})}
                placeholder="Please describe why you need counselling..."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Urgency Level</label>
              <Select 
                value={applicationData.urgency} 
                onValueChange={(value) => setApplicationData({...applicationData, urgency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="previousCounselling"
                checked={applicationData.previousCounselling}
                onChange={(e) => setApplicationData({...applicationData, previousCounselling: e.target.checked})}
              />
              <label htmlFor="previousCounselling" className="text-sm">
                I have attended counselling sessions before
              </label>
            </div>

            <div>
              <label className="text-sm font-medium">Additional Notes (Optional)</label>
              <Textarea
                value={applicationData.notes}
                onChange={(e) => setApplicationData({...applicationData, notes: e.target.value})}
                placeholder="Any additional information..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyForSession}>
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}