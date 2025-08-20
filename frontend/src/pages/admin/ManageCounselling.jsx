import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Plus, Edit, Trash2, Users, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

export default function ManageCounselling() {
  const [sessions, setSessions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const { authenticatedFetch } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    counsellorName: '',
    topic: '',
    date: '',
    time: '',
    duration: 60,
    location: 'Counselling Room',
    description: '',
    maxParticipants: 1,
    sessionType: 'individual'
  });

  useEffect(() => {
    fetchSessions();
    fetchApplications();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('http://localhost:5001/api/admin/counselling/sessions');
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        throw new Error('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch counselling sessions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await authenticatedFetch('http://localhost:5001/api/admin/counselling/applications');
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingSession 
        ? `http://localhost:5001/api/admin/counselling/sessions/${editingSession._id}`
        : 'http://localhost:5001/api/admin/counselling/sessions';
      
      const method = editingSession ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Session ${editingSession ? 'updated' : 'created'} successfully`
        });
        setIsDialogOpen(false);
        resetForm();
        fetchSessions();
      } else {
        throw new Error(`Failed to ${editingSession ? 'update' : 'create'} session`);
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingSession ? 'update' : 'create'} session`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const response = await authenticatedFetch(`http://localhost:5001/api/admin/counselling/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Session deleted successfully"
        });
        fetchSessions();
      } else {
        throw new Error('Failed to delete session');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive"
      });
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status, notes = '') => {
    try {
      const response = await authenticatedFetch(
        `http://localhost:5001/api/admin/counselling/applications/${applicationId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ status, counsellorNotes: notes })
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application status updated successfully"
        });
        fetchApplications();
      } else {
        throw new Error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      counsellorName: '',
      topic: '',
      date: '',
      time: '',
      duration: 60,
      location: 'Counselling Room',
      description: '',
      maxParticipants: 1,
      sessionType: 'individual'
    });
    setEditingSession(null);
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      counsellorName: session.counsellorName,
      topic: session.topic,
      date: new Date(session.date).toISOString().split('T')[0],
      time: session.time,
      duration: session.duration,
      location: session.location,
      description: session.description || '',
      maxParticipants: session.maxParticipants,
      sessionType: session.sessionType
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Counselling</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage counselling sessions and applications
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'sessions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('sessions')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Sessions
        </Button>
        <Button
          variant={activeTab === 'applications' ? 'default' : 'outline'}
          onClick={() => setActiveTab('applications')}
        >
          <Users className="w-4 h-4 mr-2" />
          Applications
        </Button>
      </div>

      {activeTab === 'sessions' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Counselling Sessions</CardTitle>
                <CardDescription>
                  Manage all counselling sessions
                </CardDescription>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingSession ? 'Edit Session' : 'Create New Session'}</DialogTitle>
                    <DialogDescription>
                      {editingSession ? 'Update session details' : 'Add a new counselling session'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="counsellorName">Counsellor Name</Label>
                        <Input
                          id="counsellorName"
                          value={formData.counsellorName}
                          onChange={(e) => setFormData({...formData, counsellorName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="topic">Topic</Label>
                        <Input
                          id="topic"
                          value={formData.topic}
                          onChange={(e) => setFormData({...formData, topic: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="maxParticipants">Max Participants</Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="sessionType">Session Type</Label>
                        <Select value={formData.sessionType} onValueChange={(value) => setFormData({...formData, sessionType: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="group">Group</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Session description..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingSession ? 'Update Session' : 'Create Session'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
                      <TableHead>Counsellor</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Calendar className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-gray-500">No sessions found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sessions.map((session) => (
                        <TableRow key={session._id}>
                          <TableCell className="font-medium">{session.counsellorName}</TableCell>
                          <TableCell>{session.topic}</TableCell>
                          <TableCell>
                            <div>
                              <p>{new Date(session.date).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-500">{session.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {session.duration} min
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {session.sessionType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'}>
                              {session.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(session)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(session._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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
      )}

      {activeTab === 'applications' && (
        <Card>
          <CardHeader>
            <CardTitle>Counselling Applications</CardTitle>
            <CardDescription>
              Manage student applications for counselling sessions
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Users className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No applications found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((application) => (
                      <TableRow key={application._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{application.userId?.name}</p>
                            <p className="text-sm text-gray-500">{application.userId?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{application.sessionId?.topic}</p>
                            <p className="text-sm text-gray-500">
                              {application.sessionId?.counsellorName} - {new Date(application.sessionId?.date).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{application.reason}</TableCell>
                        <TableCell>
                          <Badge variant={
                            application.urgency === 'high' ? 'destructive' :
                            application.urgency === 'medium' ? 'default' : 'secondary'
                          }>
                            {application.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {application.status === 'applied' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateApplicationStatus(application._id, 'confirmed')}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateApplicationStatus(application._id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            {application.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateApplicationStatus(application._id, 'completed')}
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}