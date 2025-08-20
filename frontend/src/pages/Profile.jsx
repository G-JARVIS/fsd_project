import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { toast } from '@/components/ui/use-toast.js';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  Briefcase,
  Award,
  Code,
  Github,
  Linkedin,
  Globe,
  FileText,
  Upload,
  Download
} from 'lucide-react';
import { getSessionData, SESSION_KEYS } from '@/utils/sessionUtils.js';

const Profile = () => {
  const { user, authenticatedFetch, API_BASE_URL } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [resumeUploading, setResumeUploading] = useState(false);

  const branches = ['CS', 'IT', 'EXTC', 'Mech', 'Civil', 'Chemical', 'Electrical', 'Electronics', 'Biomedical', 'Other'];
  const yearsOfStudy = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/profile`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setEditForm({
          name: data.user.name || '',
          profile: {
            phone: data.user.profile?.phone || '',
            college: data.user.profile?.college || '',
            branch: data.user.profile?.branch || '',
            graduationYear: data.user.profile?.graduationYear || '',
            yearOfStudy: data.user.profile?.yearOfStudy || '',
            bio: data.user.profile?.bio || '',
            location: data.user.profile?.location || '',
            linkedin: data.user.profile?.linkedin || '',
            github: data.user.profile?.github || '',
            portfolio: data.user.profile?.portfolio || '',
            cgpa: data.user.profile?.cgpa || '',
            skills: data.user.profile?.skills || [],
            achievements: data.user.profile?.achievements || [],
            certifications: data.user.profile?.certifications || []
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({ ...prev, user: data.user }));
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    if (profileData) {
      setEditForm({
        name: profileData.user.name || '',
        profile: {
          phone: profileData.user.profile?.phone || '',
          college: profileData.user.profile?.college || '',
          branch: profileData.user.profile?.branch || '',
          graduationYear: profileData.user.profile?.graduationYear || '',
          yearOfStudy: profileData.user.profile?.yearOfStudy || '',
          bio: profileData.user.profile?.bio || '',
          location: profileData.user.profile?.location || '',
          linkedin: profileData.user.profile?.linkedin || '',
          github: profileData.user.profile?.github || '',
          portfolio: profileData.user.profile?.portfolio || '',
          cgpa: profileData.user.profile?.cgpa || '',
          skills: profileData.user.profile?.skills || [],
          achievements: profileData.user.profile?.achievements || [],
          certifications: profileData.user.profile?.certifications || []
        }
      });
    }
  };

  const addArrayItem = (field, value) => {
    if (value.trim()) {
      setEditForm(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: [...(prev.profile[field] || []), value.trim()]
        }
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setEditForm(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: prev.profile[field].filter((_, i) => i !== index)
      }
    }));
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Only PDF files are allowed for resume upload",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      // For file uploads, we need to manually handle the request to avoid JSON content-type
      const token = getSessionData(SESSION_KEYS.TOKEN);
      const response = await fetch(`${API_BASE_URL}/profile/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set it for FormData
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: "Resume uploaded successfully"
        });
        // Refresh profile data
        fetchProfile();
      } else {
        throw new Error('Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive"
      });
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return;

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/profile/resume`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Resume deleted successfully"
        });
        fetchProfile();
      } else {
        throw new Error('Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive"
      });
    }
  };

  const handleResumeDownload = () => {
    window.open(`${API_BASE_URL}/profile/resume/${profileData.user._id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p className="text-muted-foreground">Unable to load profile data</p>
        </div>
      </div>
    );
  }

  const userInitials = profileData.user.name ? 
    profileData.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={profileData.user.profile?.avatar} alt={profileData.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground text-2xl font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{profileData.user.name}</h1>
              <p className="text-muted-foreground text-lg">{profileData.user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {profileData.user.role}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" />
                  Level {profileData.user.profile?.level || 1}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" />
                  XP: {profileData.user.profile?.xp || 0} / 1000
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{profileData.stats.totalCourses}</div>
              <div className="text-sm text-muted-foreground">Courses Enrolled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{profileData.stats.completedCourses}</div>
              <div className="text-sm text-muted-foreground">Courses Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{profileData.stats.totalApplications}</div>
              <div className="text-sm text-muted-foreground">Applications Sent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{profileData.stats.selectedApplications}</div>
              <div className="text-sm text-muted-foreground">Selections</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {profileData.user.name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 p-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {profileData.user.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editForm.profile.phone}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        profile: { ...prev.profile, phone: e.target.value }
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {profileData.user.profile?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editForm.profile.location}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        profile: { ...prev.profile, location: e.target.value }
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {profileData.user.profile?.location || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editForm.profile.bio}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      profile: { ...prev.profile, bio: e.target.value }
                    }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                ) : (
                  <div className="p-2 min-h-[100px] bg-muted/50 rounded-md">
                    {profileData.user.profile?.bio || 'No bio provided'}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Resume</h3>
                <div className="border rounded-lg p-4">
                  {profileData.user.profile?.resume ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{profileData.user.profile.resume}</p>
                          <p className="text-sm text-muted-foreground">PDF Document</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleResumeDownload}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleResumeDelete}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleResumeUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={resumeUploading}
                          />
                          <Button size="sm" disabled={resumeUploading}>
                            {resumeUploading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Update
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h4 className="font-medium mb-2">No resume uploaded</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload your resume in PDF format (max 5MB)
                      </p>
                      <div className="relative inline-block">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleResumeUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={resumeUploading}
                        />
                        <Button disabled={resumeUploading}>
                          {resumeUploading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          Upload Resume
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    {isEditing ? (
                      <Input
                        id="linkedin"
                        value={editForm.profile.linkedin}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          profile: { ...prev.profile, linkedin: e.target.value }
                        }))}
                        placeholder="https://linkedin.com/in/username"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <Linkedin className="w-4 h-4 text-muted-foreground" />
                        {profileData.user.profile?.linkedin ? (
                          <a href={profileData.user.profile.linkedin} target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:underline flex items-center gap-1">
                            LinkedIn Profile <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    {isEditing ? (
                      <Input
                        id="github"
                        value={editForm.profile.github}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          profile: { ...prev.profile, github: e.target.value }
                        }))}
                        placeholder="https://github.com/username"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <Github className="w-4 h-4 text-muted-foreground" />
                        {profileData.user.profile?.github ? (
                          <a href={profileData.user.profile.github} target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:underline flex items-center gap-1">
                            GitHub Profile <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio</Label>
                    {isEditing ? (
                      <Input
                        id="portfolio"
                        value={editForm.profile.portfolio}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          profile: { ...prev.profile, portfolio: e.target.value }
                        }))}
                        placeholder="https://yourportfolio.com"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        {profileData.user.profile?.portfolio ? (
                          <a href={profileData.user.profile.portfolio} target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:underline flex items-center gap-1">
                            Portfolio <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information Tab */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Your educational background and academic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="college">College/University</Label>
                  {isEditing ? (
                    <Input
                      id="college"
                      value={editForm.profile.college}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        profile: { ...prev.profile, college: e.target.value }
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      {profileData.user.profile?.college || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  {isEditing ? (
                    <Select
                      value={editForm.profile.branch}
                      onValueChange={(value) => setEditForm(prev => ({
                        ...prev,
                        profile: { ...prev.profile, branch: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Code className="w-4 h-4 text-muted-foreground" />
                      {profileData.user.profile?.branch || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Year of Study</Label>
                  {isEditing ? (
                    <Select
                      value={editForm.profile.yearOfStudy}
                      onValueChange={(value) => setEditForm(prev => ({
                        ...prev,
                        profile: { ...prev.profile, yearOfStudy: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearsOfStudy.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {profileData.user.profile?.yearOfStudy || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  {isEditing ? (
                    <Input
                      id="graduationYear"
                      type="number"
                      value={editForm.profile.graduationYear}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        profile: { ...prev.profile, graduationYear: parseInt(e.target.value) || '' }
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      {profileData.user.profile?.graduationYear || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  {isEditing ? (
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      max="10"
                      value={editForm.profile.cgpa}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        profile: { ...prev.profile, cgpa: parseFloat(e.target.value) || '' }
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      {profileData.user.profile?.cgpa || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Skills Section */}
              <SkillsSection
                title="Skills"
                items={isEditing ? editForm.profile.skills : profileData.user.profile?.skills || []}
                isEditing={isEditing}
                onAdd={(value) => addArrayItem('skills', value)}
                onRemove={(index) => removeArrayItem('skills', index)}
              />

              <Separator />

              {/* Achievements Section */}
              <SkillsSection
                title="Achievements"
                items={isEditing ? editForm.profile.achievements : profileData.user.profile?.achievements || []}
                isEditing={isEditing}
                onAdd={(value) => addArrayItem('achievements', value)}
                onRemove={(index) => removeArrayItem('achievements', index)}
              />

              <Separator />

              {/* Certifications Section */}
              <SkillsSection
                title="Certifications"
                items={isEditing ? editForm.profile.certifications : profileData.user.profile?.certifications || []}
                isEditing={isEditing}
                onAdd={(value) => addArrayItem('certifications', value)}
                onRemove={(index) => removeArrayItem('certifications', index)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Courses you've enrolled in and completed</CardDescription>
            </CardHeader>
            <CardContent>
              {profileData.courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground">Start learning by enrolling in courses</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profileData.courses.map((userCourse) => (
                    <div key={userCourse._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{userCourse.course.title}</h3>
                        <Badge variant={userCourse.status === 'completed' ? 'default' : 'secondary'}>
                          {userCourse.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{userCourse.course.category}</span>
                        <span>{userCourse.course.difficulty}</span>
                        <span>{userCourse.course.duration}h</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{userCourse.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${userCourse.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Company drives you've applied to</CardDescription>
            </CardHeader>
            <CardContent>
              {profileData.applications.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground">Start applying to company drives</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profileData.applications.map((application) => (
                    <div key={application._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{application.driveId?.company}</h3>
                          <p className="text-sm text-muted-foreground">{application.driveId?.role}</p>
                        </div>
                        <Badge variant={
                          application.status === 'selected' ? 'default' :
                          application.status === 'rejected' ? 'destructive' :
                          application.status === 'shortlisted' ? 'secondary' : 'outline'
                        }>
                          {application.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{application.driveId?.location}</span>
                        <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                        {application.driveId?.package && <span>₹{application.driveId.package}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Skills Section Component
const SkillsSection = ({ title, items, isEditing, onAdd, onRemove }) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem);
      setNewItem('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="gap-2">
            {item}
            {isEditing && (
              <button
                onClick={() => onRemove(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      {isEditing && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Add ${title.toLowerCase()}`}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;