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
import { Plus, Edit, Trash2, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const { authenticatedFetch } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    roleName: '',
    techStack: [],
    averagePackage: '',
    description: '',
    majorCompanies: [],
    skillsRequired: [],
    careerPath: '',
    workEnvironment: '',
    jobResponsibilities: [],
    educationRequirements: [],
    experienceLevel: 'All Levels',
    industryDemand: 'Medium',
    remoteWorkOptions: 'Varies',
    featured: false
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('http://localhost:5001/api/admin/roles');
      
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        throw new Error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch job roles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingRole 
        ? `http://localhost:5001/api/admin/roles/${editingRole._id}`
        : 'http://localhost:5001/api/admin/roles';
      
      const method = editingRole ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Role ${editingRole ? 'updated' : 'created'} successfully`
        });
        setIsDialogOpen(false);
        resetForm();
        fetchRoles();
      } else {
        throw new Error(`Failed to ${editingRole ? 'update' : 'create'} role`);
      }
    } catch (error) {
      console.error('Error saving role:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingRole ? 'update' : 'create'} role`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const response = await authenticatedFetch(`http://localhost:5001/api/admin/roles/${roleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Role deleted successfully"
        });
        fetchRoles();
      } else {
        throw new Error('Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      roleName: '',
      techStack: [],
      averagePackage: '',
      description: '',
      majorCompanies: [],
      skillsRequired: [],
      careerPath: '',
      workEnvironment: '',
      jobResponsibilities: [],
      educationRequirements: [],
      experienceLevel: 'All Levels',
      industryDemand: 'Medium',
      remoteWorkOptions: 'Varies',
      featured: false
    });
    setEditingRole(null);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      roleName: role.roleName,
      techStack: role.techStack || [],
      averagePackage: role.averagePackage,
      description: role.description,
      majorCompanies: role.majorCompanies || [],
      skillsRequired: role.skillsRequired || [],
      careerPath: role.careerPath || '',
      workEnvironment: role.workEnvironment || '',
      jobResponsibilities: role.jobResponsibilities || [],
      educationRequirements: role.educationRequirements || [],
      experienceLevel: role.experienceLevel,
      industryDemand: role.industryDemand,
      remoteWorkOptions: role.remoteWorkOptions,
      featured: role.featured
    });
    setIsDialogOpen(true);
  };

  const handleArrayInput = (field, value) => {
    const items = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, [field]: items });
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Very High': return 'bg-green-500';
      case 'High': return 'bg-blue-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Job Roles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage informational job role descriptions
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
              <DialogDescription>
                {editingRole ? 'Update role information' : 'Add a new job role for students to explore'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={formData.roleName}
                    onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                    placeholder="e.g., Full Stack Developer"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="averagePackage">Average Package</Label>
                  <Input
                    id="averagePackage"
                    value={formData.averagePackage}
                    onChange={(e) => setFormData({...formData, averagePackage: e.target.value})}
                    placeholder="e.g., 8-15 LPA"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({...formData, experienceLevel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry Level">Entry Level</SelectItem>
                      <SelectItem value="Mid Level">Mid Level</SelectItem>
                      <SelectItem value="Senior Level">Senior Level</SelectItem>
                      <SelectItem value="All Levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="industryDemand">Industry Demand</Label>
                  <Select value={formData.industryDemand} onValueChange={(value) => setFormData({...formData, industryDemand: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Very High">Very High</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="remoteWorkOptions">Remote Work Options</Label>
                  <Select value={formData.remoteWorkOptions} onValueChange={(value) => setFormData({...formData, remoteWorkOptions: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fully Remote">Fully Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Varies">Varies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <Label htmlFor="featured">Featured Role</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Role Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this role involves..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="techStack">Basic Tech Stack (one per line)</Label>
                <Textarea
                  id="techStack"
                  value={formData.techStack.join('\n')}
                  onChange={(e) => handleArrayInput('techStack', e.target.value)}
                  placeholder="React&#10;Node.js&#10;MongoDB&#10;Express"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="majorCompanies">Major Companies (one per line)</Label>
                <Textarea
                  id="majorCompanies"
                  value={formData.majorCompanies.join('\n')}
                  onChange={(e) => handleArrayInput('majorCompanies', e.target.value)}
                  placeholder="Google&#10;Microsoft&#10;Amazon&#10;Meta"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="skillsRequired">Skills Required (one per line)</Label>
                <Textarea
                  id="skillsRequired"
                  value={formData.skillsRequired.join('\n')}
                  onChange={(e) => handleArrayInput('skillsRequired', e.target.value)}
                  placeholder="Problem Solving&#10;Communication&#10;Team Work"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="jobResponsibilities">Job Responsibilities (one per line)</Label>
                <Textarea
                  id="jobResponsibilities"
                  value={formData.jobResponsibilities.join('\n')}
                  onChange={(e) => handleArrayInput('jobResponsibilities', e.target.value)}
                  placeholder="Develop web applications&#10;Write clean code&#10;Collaborate with team"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="careerPath">Career Path</Label>
                  <Textarea
                    id="careerPath"
                    value={formData.careerPath}
                    onChange={(e) => setFormData({...formData, careerPath: e.target.value})}
                    placeholder="Typical career progression for this role..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="workEnvironment">Work Environment</Label>
                  <Textarea
                    id="workEnvironment"
                    value={formData.workEnvironment}
                    onChange={(e) => setFormData({...formData, workEnvironment: e.target.value})}
                    placeholder="Describe the typical work environment..."
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="educationRequirements">Education Requirements (one per line)</Label>
                <Textarea
                  id="educationRequirements"
                  value={formData.educationRequirements.join('\n')}
                  onChange={(e) => handleArrayInput('educationRequirements', e.target.value)}
                  placeholder="Bachelor's in Computer Science&#10;Relevant certifications&#10;Portfolio projects"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRole ? 'Update Role' : 'Create Role'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Roles Directory</CardTitle>
          <CardDescription>
            Manage all informational job roles for students to explore
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
                    <TableHead>Role Name</TableHead>
                    <TableHead>Average Package</TableHead>
                    <TableHead>Experience Level</TableHead>
                    <TableHead>Industry Demand</TableHead>
                    <TableHead>Tech Stack</TableHead>
                    <TableHead>Major Companies</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Briefcase className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No roles found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    roles.map((role) => (
                      <TableRow key={role._id}>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="font-medium">{role.roleName}</span>
                            {role.featured && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {role.averagePackage}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {role.experienceLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${getDemandColor(role.industryDemand)}`}></div>
                            {role.industryDemand}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.techStack?.slice(0, 3).map((tech, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {role.techStack?.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{role.techStack.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.majorCompanies?.slice(0, 2).map((company, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {company}
                              </Badge>
                            ))}
                            {role.majorCompanies?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.majorCompanies.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(role)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(role._id)}
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