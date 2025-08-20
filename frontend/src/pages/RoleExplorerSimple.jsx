import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog.jsx";
import { Search, Briefcase, DollarSign, Building2, Star, Info } from "lucide-react";

export default function RoleExplorerSimple() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = roles.filter(role =>
        role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.techStack?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
        role.majorCompanies?.some(company => company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles(roles);
    }
  }, [searchQuery, roles]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/roles');
      
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
        setFilteredRoles(data.roles || []);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (role) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">Error: {error}</div>
            <Button onClick={fetchRoles}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Explore Career Roles</h1>
            <p className="opacity-90">Discover {roles.length} career paths and their requirements</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            placeholder="Search by role name, tech stack, or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Results */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          {searchQuery ? `Found ${filteredRoles.length} roles matching "${searchQuery}"` : `All ${roles.length} Career Roles`}
        </h2>
        
        <div className="grid gap-4">
          {filteredRoles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                {roles.length === 0 ? (
                  <>
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold mb-2">No roles available</h3>
                    <p className="text-muted-foreground mb-4">Please run the seed script to add sample roles:</p>
                    <code className="block p-3 bg-muted rounded text-sm">
                      cd backend && npm run seed-roles
                    </code>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">No matching roles</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search terms</p>
                    <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredRoles.map((role) => (
              <Card key={role._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{role.roleName}</h3>
                        {role.featured && (
                          <Badge className="bg-primary text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant="outline">{role.experienceLevel}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getDemandColor(role.industryDemand)}`}></div>
                          {role.industryDemand} Demand
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {role.averagePackage}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">{role.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {role.techStack?.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                        {role.techStack?.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{role.techStack.length - 4} more</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          <span>{role.majorCompanies?.slice(0, 2).join(', ')}</span>
                          {role.majorCompanies?.length > 2 && (
                            <span>+{role.majorCompanies.length - 2} more</span>
                          )}
                        </div>
                        
                        <Button onClick={() => handleViewDetails(role)} size="sm">
                          <Info className="w-4 h-4 mr-2" />
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Role Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRole && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary">{selectedRole.roleName}</DialogTitle>
                <DialogDescription className="text-lg">
                  {selectedRole.experienceLevel} • {selectedRole.industryDemand} Demand • {selectedRole.averagePackage}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Role Overview</h3>
                  <p className="text-muted-foreground">{selectedRole.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.techStack?.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Major Companies Hiring</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.majorCompanies?.map((company) => (
                      <Badge key={company} variant="outline">{company}</Badge>
                    ))}
                  </div>
                </div>

                {selectedRole.jobResponsibilities && selectedRole.jobResponsibilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {selectedRole.jobResponsibilities.map((responsibility, i) => (
                        <li key={i}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedRole.skillsRequired && selectedRole.skillsRequired.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.skillsRequired.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRole.careerPath && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Career Path</h3>
                    <p className="text-muted-foreground">{selectedRole.careerPath}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}