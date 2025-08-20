import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Search, TrendingUp, Briefcase, Star, Building2, DollarSign, ArrowRight, Sparkles, Code, Globe, Zap, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";

export default function RoleExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [demandFilter, setDemandFilter] = useState("");
  const [stats, setStats] = useState(null);
  
  const { API_BASE_URL } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
    fetchStats();
  }, [experienceFilter, demandFilter]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (experienceFilter) params.append('experienceLevel', experienceFilter);
      if (demandFilter) params.append('industryDemand', demandFilter);
      
      const url = `${API_BASE_URL}/roles${params.toString() ? '?' + params.toString() : ''}`;
      console.log('Fetching roles from:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Roles data:', data);
        setRoles(data.roles || []);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to fetch roles');
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load job roles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching stats from:', `${API_BASE_URL}/roles/stats/overview`);
      const response = await fetch(`${API_BASE_URL}/roles/stats/overview`);
      console.log('Stats response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Stats data:', data);
        setStats(data);
      } else {
        console.warn('Failed to fetch stats:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleViewDetails = (role) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRole(null);
  };

  const handleSearch = () => {
    fetchRoles();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setExperienceFilter("");
    setDemandFilter("");
    fetchRoles();
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

  const getRemoteIcon = (remoteOption) => {
    switch (remoteOption) {
      case 'Fully Remote': return <Globe className="w-4 h-4" />;
      case 'Hybrid': return <Zap className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };



  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Role Explorer</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  try {
    return (
      <div className="p-6 space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Explore Career Roles</h1>
              <p className="text-lg text-white/90 mt-1">
                Discover career paths • {roles.length}+ role descriptions • Industry insights
              </p>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="flex gap-3 max-w-5xl mt-6">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-white/70 z-10" />
                <Input
                  placeholder="Search by role name, tech stack, or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 pr-4 h-14 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-2xl text-base"
                />
              </div>
            </div>
            
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="w-48 h-14 bg-white/10 backdrop-blur-xl border-white/20 text-white rounded-2xl">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={demandFilter} onValueChange={setDemandFilter}>
              <SelectTrigger className="w-48 h-14 bg-white/10 backdrop-blur-xl border-white/20 text-white rounded-2xl">
                <SelectValue placeholder="Industry Demand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Demand</SelectItem>
                <SelectItem value="Very High">Very High</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleSearch}
              size="lg"
              className="h-14 px-6 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-2xl"
            >
              Search
            </Button>
            
            <Button 
              onClick={clearFilters}
              variant="outline"
              size="lg"
              className="h-14 px-6 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-2xl"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, value: `${stats?.totalRoles || roles.length}`, label: "Career Roles", color: "primary", gradient: "from-primary to-primary/80" },
          { icon: Code, value: `${stats?.topTechnologies?.length || 50}+`, label: "Technologies", color: "success", gradient: "from-success to-success/80" },
          { icon: Building2, value: "500+", label: "Companies", color: "accent", gradient: "from-accent to-accent/80" },
          { icon: TrendingUp, value: "Growing", label: "Market Demand", color: "warning", gradient: "from-warning to-warning/80" },
        ].map((stat, index) => (
          <Card 
            key={index}
            className="group bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <stat.icon className="w-7 h-7 text-white relative z-10" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{roles.length} Career Roles Found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery || experienceFilter || demandFilter 
              ? "Filtered results" 
              : "Explore all career paths and their requirements"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">Informational Guide</Badge>
        </div>
      </div>

      {/* Premium Role Cards */}
      <div className="grid gap-5">
        {roles.length === 0 && !loading ? (
          <Card className="bg-gradient-glass border-border/50">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No roles found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || experienceFilter || demandFilter 
                  ? "No roles match your current filters" 
                  : "No role data available. Please contact admin to add role information."}
              </p>
              <Button onClick={clearFilters} className="bg-gradient-to-r from-primary to-accent">
                <Sparkles className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          roles.map((role, index) => (
          <Card 
            key={role._id}
            className="group bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
            style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="p-7 relative">
              <div className="flex items-start gap-6">
                {/* Role Icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/20 shadow-lg">
                    <Briefcase className="w-10 h-10 text-primary" />
                  </div>
                </div>

                {/* Role Details */}
                <div className="flex-1 min-w-0">
                  {/* Title Row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                          {role.roleName}
                        </h3>
                        {role.featured && (
                          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-lg shadow-primary/30">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {role.experienceLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full mr-1 ${getDemandColor(role.industryDemand)}`}></div>
                          {role.industryDemand} Demand
                        </span>
                        <span className="flex items-center gap-1.5">
                          {getRemoteIcon(role.remoteWorkOptions)}
                          {role.remoteWorkOptions}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted/30 rounded-xl">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Average Package
                      </p>
                      <p className="text-lg font-bold text-primary flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {role.averagePackage}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Major Companies
                      </p>
                      <p className="text-sm font-medium">{role.majorCompanies?.slice(0, 2).join(', ')}</p>
                      {role.majorCompanies?.length > 2 && (
                        <p className="text-xs text-muted-foreground">+{role.majorCompanies.length - 2} more</p>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {role.techStack?.slice(0, 6).map((tech) => (
                      <Badge 
                        key={tech} 
                        variant="outline" 
                        className="px-3 py-1 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 border-primary/20 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {role.techStack?.length > 6 && (
                      <Badge variant="outline" className="px-3 py-1">
                        +{role.techStack.length - 6} more
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      size="lg"
                      onClick={() => handleViewDetails(role)} 
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {roles.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="outline" size="lg" className="px-8">
            Load More Roles
          </Button>
        </div>
      )}

      {/* Role Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
              {selectedRole && (
                  <>
                      <DialogHeader className="p-6 pb-0">
                          <DialogTitle className="text-3xl font-bold text-primary">{selectedRole.roleName}</DialogTitle>
                          <DialogDescription className="text-lg text-muted-foreground pt-1">
                              {selectedRole.experienceLevel} • {selectedRole.industryDemand} Demand • {selectedRole.remoteWorkOptions}
                          </DialogDescription>
                      </DialogHeader>

                      <div className="p-6 pt-0 space-y-6">
                          {/* Basic Info */}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b pb-4">
                              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />{selectedRole.averagePackage}</span>
                              <span className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full mr-1 ${getDemandColor(selectedRole.industryDemand)}`}></div>
                                {selectedRole.industryDemand} Demand
                              </span>
                              <span className="flex items-center gap-1.5">
                                {getRemoteIcon(selectedRole.remoteWorkOptions)}
                                {selectedRole.remoteWorkOptions}
                              </span>
                              {selectedRole.featured && (
                                <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                                  <Star className="w-3 h-3 mr-1 fill-current" />
                                  Featured Role
                                </Badge>
                              )}
                          </div>

                          {/* Description */}
                          <div>
                              <h3 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">Role Overview</h3>
                              <p className="text-muted-foreground leading-relaxed">{selectedRole.description}</p>
                          </div>

                          {/* Tech Stack */}
                          <div>
                              <h3 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">Tech Stack</h3>
                              <div className="flex flex-wrap gap-2">
                                  {selectedRole.techStack?.map((tech) => (
                                      <Badge key={tech} variant="secondary" className="px-3 py-1">{tech}</Badge>
                                  ))}
                              </div>
                          </div>

                          {/* Major Companies */}
                          <div>
                              <h3 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">Major Companies Hiring</h3>
                              <div className="flex flex-wrap gap-2">
                                  {selectedRole.majorCompanies?.map((company) => (
                                      <Badge key={company} variant="outline" className="px-3 py-1 bg-primary/5 border-primary/20">{company}</Badge>
                                  ))}
                              </div>
                          </div>

                          {/* Job Responsibilities */}
                          {selectedRole.jobResponsibilities && selectedRole.jobResponsibilities.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">Key Responsibilities</h3>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                                    {selectedRole.jobResponsibilities.map((responsibility, i) => <li key={i}>{responsibility}</li>)}
                                </ul>
                            </div>
                          )}

                          {/* Skills Required */}
                          {selectedRole.skillsRequired && selectedRole.skillsRequired.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">Skills Required</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRole.skillsRequired.map((skill) => (
                                        <Badge key={skill} variant="outline" className="px-3 py-1">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                          )}

                          {/* Education Requirements */}
                          {selectedRole.educationRequirements && selectedRole.educationRequirements.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">Education Requirements</h3>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                                    {selectedRole.educationRequirements.map((req, i) => <li key={i}>{req}</li>)}
                                </ul>
                            </div>
                          )}
                          
                          {/* Career Path */}
                          {selectedRole.careerPath && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">Career Path</h3>
                                <p className="text-muted-foreground leading-relaxed">{selectedRole.careerPath}</p>
                            </div>
                          )}

                          {/* Work Environment */}
                          {selectedRole.workEnvironment && (
                            <div>
                                <h3 className="text-xl font-semibold mb-3 border-l-4 border-primary pl-3">Work Environment</h3>
                                <p className="text-muted-foreground leading-relaxed">{selectedRole.workEnvironment}</p>
                            </div>
                          )}
                      </div>

                      {/* Dialog Footer */}
                      <div className="sticky bottom-0 bg-card p-4 border-t flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                              This is an informational guide to help you understand career roles
                          </div>
                          <Button onClick={handleCloseDialog} className="bg-gradient-to-r from-primary to-accent">
                              Close
                          </Button>
                      </div>
                  </>
              )}
          </DialogContent>
      </Dialog>
      </div>
    );
  } catch (renderError) {
    console.error('Render error in RoleExplorer:', renderError);
    return (
      <div className="p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Component Error</h3>
            <p className="text-sm text-gray-600 mb-4">
              There was an error rendering the Role Explorer. Please check the console for details.
            </p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}