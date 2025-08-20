import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Plus, Edit, Trash2, Building2, Users, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast.js";

export default function ManageDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const { authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    package: '',
    deadline: '',
    description: '',
    requirements: [],
    eligibility: [],
    process: [],
    isActive: true
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('http://localhost:5001/api/admin/drives');
      
      if (response.ok) {
        const data = await response.json();
        setDrives(data);
      } else {
        throw new Error('Failed to fetch drives');
      }
    } catch (error) {
      console.error('Error fetching drives:', error);
      toast({
        title: "Error",
        description: "Failed to fetch drives",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingDrive 
        ? `http://localhost:5001/api/admin/drives/${editingDrive._id}`
        : 'http://localhost:5001/api/admin/drives';
      
      const method = editingDrive ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Drive ${editingDrive ? 'updated' : 'created'} successfully`
        });
        setIsDialogOpen(false);
        resetForm();
        fetchDrives();
      } else {
        throw new Error(`Failed to ${editingDrive ? 'update' : 'create'} drive`);
      }
    } catch (error) {
      console.error('Error saving drive:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingDrive ? 'update' : 'create'} drive`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (driveId) => {
    if (!confirm('Are you sure you want to delete this drive?')) return;

    try {
      const response = await authenticatedFetch(`http://localhost:5001/api/admin/drives/${driveId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Drive deleted successfully"
        });
        fetchDrives();
      } else {
        throw new Error('Failed to delete drive');
      }
    } catch (error) {
      console.error('Error deleting drive:', error);
      toast({
        title: "Error",
        description: "Failed to delete drive",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      location: '',
      package: '',
      deadline: '',
      description: '',
      requirements: [],
      eligibility: [],
      process: [],
      isActive: true
    });
    setEditingDrive(null);
  };

  const handleEdit = (drive) => {
    setEditingDrive(drive);
    setFormData({
      company: drive.company,
      role: drive.role,
      location: drive.location,
      package: drive.package,
      deadline: new Date(drive.deadline).toISOString().split('T')[0],
      description: drive.description || '',
      requirements: drive.requirements || [],
      eligibility: drive.eligibility || [],
      process: drive.process || [],
      isActive: drive.isActive
    });
    setIsDialogOpen(true);
  };

  const handleArrayInput = (field, value) => {
    const items = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, [field]: items });
  };

  const viewApplications = (driveId) => {
    navigate(`/admin/drives/${driveId}/applications`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Company Drives</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage recruitment drives
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Drive
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDrive ? 'Edit Drive' : 'Create New Drive'}</DialogTitle>
              <DialogDescription>
                {editingDrive ? 'Update drive details' : 'Add a new company recruitment drive'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Job Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
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
                  <Label htmlFor="package">Package</Label>
                  <Input
                    id="package"
                    value={formData.package}
                    onChange={(e) => setFormData({...formData, package: e.target.value})}
                    placeholder="e.g., 12-15 LPA"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements.join('\n')}
                  onChange={(e) => handleArrayInput('requirements', e.target.value)}
                  placeholder="Bachelor's degree in Computer Science&#10;2+ years of experience&#10;Knowledge of React, Node.js"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="eligibility">Eligibility Criteria (one per line)</Label>
                <Textarea
                  id="eligibility"
                  value={formData.eligibility.join('\n')}
                  onChange={(e) => handleArrayInput('eligibility', e.target.value)}
                  placeholder="CGPA >= 7.0&#10;No active backlogs&#10;Final year students only"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="process">Selection Process (one per line)</Label>
                <Textarea
                  id="process"
                  value={formData.process.join('\n')}
                  onChange={(e) => handleArrayInput('process', e.target.value)}
                  placeholder="Online Assessment&#10;Technical Interview&#10;HR Interview"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <Label htmlFor="isActive">Active Drive</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDrive ? 'Update Drive' : 'Create Drive'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Drives</CardTitle>
          <CardDescription>
            Manage all recruitment drives
          </CardDescription>
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
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Building2 className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No drives found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    drives.map((drive) => (
                      <TableRow key={drive._id}>
                        <TableCell className="font-medium">{drive.company}</TableCell>
                        <TableCell>{drive.role}</TableCell>
                        <TableCell>{drive.location}</TableCell>
                        <TableCell>{drive.package}</TableCell>
                        <TableCell>
                          {new Date(drive.deadline).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {drive.applicants || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={drive.isActive ? 'default' : 'secondary'}>
                            {drive.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewApplications(drive._id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(drive)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(drive._id)}
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
    </div>
  );
}