import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Bookmark, Clock, MapPin, Users, Calendar, Star, Search, Filter, Building2, DollarSign, ArrowRight, TrendingUp, Sparkles, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useToast } from "@/components/ui/use-toast.js";
import ApplicationStatusModal from "@/components/applications/ApplicationStatusModal.jsx";
import DriveInfoModal from "@/components/drives/DriveInfoModal.jsx";

export default function MyDrives() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedDriveId, setSelectedDriveId] = useState(null);
  
  const { getAuthHeaders, API_BASE_URL } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDrives();
    fetchApplications();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/drives`);
      if (response.ok) {
        const data = await response.json();
        setDrives(data.drives || []);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to fetch drives:', error);
      toast({
        title: "Error",
        description: "Failed to load company drives",
        variant: "destructive"
      });
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/drives`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/drives/${driveId}/apply`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const newApplication = await response.json();
        
        // Add the new application to the applications state
        setApplications(prev => [...prev, {
          id: newApplication._id,
          driveId: driveId,
          status: 'applied',
          appliedDate: new Date().toISOString(),
          currentStage: 'Applied',
          nextStep: 'Online Test'
        }]);
        
        toast({
          title: "Application Submitted!",
          description: "Your application has been submitted successfully",
        });
        
        // Refresh drives to update applicant count
        await fetchDrives();
      } else {
        const error = await response.json();
        toast({
          title: "Application Failed",
          description: error.message || "Failed to submit application",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast({
        title: "Network Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  // Merge drives with application status
  const drivesWithStatus = drives.map(drive => {
    const application = applications.find(app => app.driveId === drive._id);
    return {
      ...drive,
      status: application?.status || 'eligible',
      appliedDate: application?.appliedDate,
      currentStage: application?.currentStage,
      nextStep: application?.nextStep,
      processStageIndex: application?.processStageIndex || 0,
      applicationId: application?.id
    };
  });

  const filteredDrives = drivesWithStatus.filter(drive => {
    const matchesTab = activeTab === "all" || drive.status === activeTab;
    const matchesSearch =
      drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      applied: "bg-primary/10 text-primary border-primary/20",
      bookmarked: "bg-warning/10 text-warning border-warning/20",
      eligible: "bg-success/10 text-success border-success/20",
      rejected: "bg-destructive/10 text-destructive border-destructive/20",
      shortlisted: "bg-accent/10 text-accent border-accent/20",
      interview: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      selected: "bg-green-500/10 text-green-500 border-green-500/20"
    };
    return styles[status] || "";
  };

  const tabs = [
    { id: "all", label: "All Drives", count: drivesWithStatus.length },
    { id: "applied", label: "Applied", count: drivesWithStatus.filter(d => d.status === "applied").length },
    { id: "bookmarked", label: "Bookmarked", count: drivesWithStatus.filter(d => d.status === "bookmarked").length },
    { id: "eligible", label: "Eligible", count: drivesWithStatus.filter(d => d.status === "eligible").length },
  ];

  const handleViewStatus = (drive) => {
    setSelectedApplicationId(drive.applicationId);
    setStatusModalOpen(true);
  };

  const handleViewInfo = (driveId) => {
    setSelectedDriveId(driveId);
    setInfoModalOpen(true);
  };

  const getActionButton = (drive) => {
    switch (drive.status) {
      case "eligible":
      case "bookmarked":
        return (
          <Button 
            className="bg-gradient-to-r from-primary to-accent" 
            size="sm"
            onClick={() => handleApply(drive._id)}
          >
            Apply Now
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        );
      case "applied":
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewStatus(drive)}
          >
            View Status
          </Button>
        );
      case "rejected":
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewStatus(drive)}
            className="text-destructive hover:text-destructive"
          >
            View Details
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-primary to-accent p-10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Placement Drives</h1>
              <p className="text-lg text-white/90 mt-1">
                Track applications • Discover opportunities • Land your dream job
              </p>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="flex gap-3 max-w-3xl mt-6">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-white/70 z-10" />
                <Input
                  placeholder="Search companies or roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-2xl text-base"
                />
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="h-14 px-6 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 rounded-2xl"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Users, value: drivesWithStatus.filter(d => d.status === "applied").length, label: "Applied", gradient: "from-primary to-primary/80" },
          { icon: Bookmark, value: drivesWithStatus.filter(d => d.status === "bookmarked").length, label: "Bookmarked", gradient: "from-warning to-warning/80" },
          { icon: Clock, value: drivesWithStatus.filter(d => d.status === "interview").length, label: "In Progress", gradient: "from-success to-success/80" },
          { icon: Star, value: "85%", label: "Profile Match", gradient: "from-accent to-accent/80" },
        ].map((stat, index) => (
          <Card 
            key={index}
            className="group bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? "bg-gradient-to-r from-primary to-accent shadow-lg" : ""}
          >
            {tab.label}
            <Badge variant="secondary" className="ml-2 text-xs bg-muted">
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        {filteredDrives.length === 0 ? (
          <Card className="bg-gradient-glass border-border/50">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No drives found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? `No results for "${searchQuery}"` : "No drives match your current filter"}
              </p>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Sparkles className="w-4 h-4 mr-2" />
                Explore All Drives
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDrives.map((drive, index) => (
            <Card 
              key={drive._id} 
              className="group bg-gradient-glass border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
              style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-7 relative">
                <div className="flex items-start gap-6">
                  {/* Company Logo */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-card to-muted/50 flex items-center justify-center text-4xl border border-border/50 shadow-lg">
                      {drive.logo || "🏢"}
                    </div>
                  </div>

                  {/* Drive Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                            {drive.company}
                          </h3>
                          {drive.featured && (
                            <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          )}
                          <Badge variant="outline" className={getStatusBadge(drive.status)}>
                            {drive.status}
                          </Badge>
                        </div>
                        <h4 className="text-lg font-semibold mb-4 text-muted-foreground">
                          {drive.role}
                        </h4>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-xl">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Location
                        </p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {drive.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Package
                        </p>
                        <p className="text-sm font-bold text-primary flex items-center gap-1">
                          {drive.package}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Deadline
                        </p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(drive.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Application Progress */}
                    {drive.status === "applied" && (
                      <div className="p-4 mb-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold mb-1">
                              Current Stage: <span className="text-primary">{drive.currentStage || 'Application Submitted'}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Applied on {new Date(drive.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                          {drive.nextStep && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              Next: {drive.nextStep}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rejected Application Status */}
                    {drive.status === "rejected" && (
                      <div className="p-4 mb-4 rounded-xl bg-gradient-to-r from-destructive/10 to-red-100/10 border border-destructive/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold mb-1 text-destructive">
                              Application Rejected
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Applied on {new Date(drive.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                            Rejected
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Requirements & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {drive.requirements.map((req) => (
                          <Badge 
                            key={req} 
                            variant="outline" 
                            className="text-xs px-2 py-1 bg-muted/20"
                          >
                            {req}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-muted/20">
                          <Users className="w-3 h-3 mr-1" />
                          {drive.applicants} applicants
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewInfo(drive._id)}
                          className="hover:bg-primary/10"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        {getActionButton(drive)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Application Status Modal */}
      <ApplicationStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        applicationId={selectedApplicationId}
      />

      {/* Drive Info Modal */}
      <DriveInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        driveId={selectedDriveId}
      />
    </div>
  );
}