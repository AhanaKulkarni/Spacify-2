import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import FurniturePanel from "@/components/FurniturePanel";
import { Room2DView } from "@/components/Room2DView";
import { Room3DView } from "@/components/Room3DView";
import { ARViewer } from "@/components/ARViewer";
import { VastuPanel } from "@/components/VastuPanel";
import { Moodboard } from "@/components/Moodboard";
import { NotesDrawer } from "@/components/NotesDrawer";
import { InvoicePage } from "@/components/InvoicePage";
import { 
  ArrowLeft, 
  Share, 
  Save, 
  FileText, 
  Camera, 
  Eye,
  Settings
} from "lucide-react";
import { Project } from "@shared/schema";

export default function ProjectEditor() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id ? parseInt(params.id) : null;
  
  const { 
    currentView, 
    setCurrentView, 
    vastuMode, 
    toggleVastuMode,
    selectedProject,
    setSelectedProject,
    showARModal,
    setShowARModal
  } = useStore();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showInvoice, setShowInvoice] = useState(false);

  // Fetch project data
  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      toast({ title: "Project saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save project", variant: "destructive" });
    },
  });

  // Generate collaboration link mutation
  const generateLinkMutation = useMutation({
    mutationFn: async (canEdit: boolean) => {
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canEdit }),
      });
      if (!response.ok) throw new Error("Failed to generate link");
      return response.json();
    },
    onSuccess: (data) => {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/collaborate/${data.linkId}`;
      navigator.clipboard.writeText(shareUrl);
      toast({ title: "Share link copied to clipboard!" });
    },
  });

  useEffect(() => {
    if (project) {
      setSelectedProject(project);
    }
  }, [project, setSelectedProject]);

  const handleSave = () => {
    if (selectedProject) {
      updateProjectMutation.mutate({
        vastuEnabled: vastuMode,
        updatedAt: new Date(),
      });
    }
  };

  const handleShare = () => {
    generateLinkMutation.mutate(false); // View-only by default
  };

  const handleVastuToggle = () => {
    toggleVastuMode();
    if (selectedProject) {
      updateProjectMutation.mutate({ vastuEnabled: !vastuMode });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-midnight-800 dark:text-white mb-4">
            Project Not Found
          </h2>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (showInvoice) {
    return <InvoicePage project={project} onClose={() => setShowInvoice(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-50 to-blue-50 dark:from-midnight-900 dark:to-midnight-800">
      {/* Editor Header */}
      <div className="glassmorphism rounded-xl p-4 mb-6 mx-4 mt-4 border shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-midnight-600 dark:text-midnight-300 hover:text-blue-600 p-2 rounded-lg hover:bg-white dark:hover:bg-midnight-700 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-midnight-800 dark:text-white">
                {project.name}
              </h2>
              <p className="text-midnight-600 dark:text-midnight-400 text-sm">
                {project.clientName} • {project.dimensions?.length}×{project.dimensions?.width} ft
              </p>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <div className="flex bg-white dark:bg-midnight-700 rounded-lg p-1 border border-midnight-200 dark:border-midnight-600">
              <Button
                variant={currentView === "2d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("2d")}
                className="px-4 py-2 text-sm font-medium transition-colors"
              >
                2D
              </Button>
              <Button
                variant={currentView === "3d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("3d")}
                className="px-4 py-2 text-sm font-medium transition-colors"
              >
                3D
              </Button>
              <Button
                variant={currentView === "ar" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setCurrentView("ar");
                  setShowARModal(true);
                }}
                className="px-4 py-2 text-sm font-medium transition-colors"
              >
                AR
              </Button>
            </div>
            
            {/* Vastu Toggle */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded-lg">
              <span className="text-sm font-medium text-midnight-700 dark:text-midnight-300">Vastu</span>
              <Switch checked={vastuMode} onCheckedChange={handleVastuToggle} />
            </div>

            {/* Action Buttons */}
            <Button 
              onClick={handleShare}
              disabled={generateLinkMutation.isPending}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={updateProjectMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button 
              onClick={() => setShowInvoice(true)}
              variant="outline"
              className="px-4 py-2"
            >
              <FileText className="w-4 h-4 mr-2" />
              Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 pb-8">
        
        {/* Left Sidebar - Furniture Panel */}
        <div className="lg:col-span-1">
          <FurniturePanel />
        </div>

        {/* Main Canvas Area */}
        <div className="lg:col-span-2">
          {currentView === "2d" && <Room2DView />}
          {currentView === "3d" && <Room3DView />}
          {currentView === "ar" && showARModal && <ARViewer />}
        </div>

        {/* Right Sidebar - Tools and Info */}
        <div className="lg:col-span-1 space-y-6">
          {vastuMode && <VastuPanel />}
          <Moodboard />
          <NotesDrawer />
          
          {/* Quick Actions */}
          <div className="glassmorphism rounded-xl p-6 border shadow-lg">
            <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                onClick={handleShare}
                className="w-full p-3 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded-lg text-left hover:shadow-md transition-all justify-start"
                variant="outline"
              >
                <Share className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-midnight-700 dark:text-midnight-300">Share with Client</span>
              </Button>
              
              <Button 
                onClick={() => setShowInvoice(true)}
                className="w-full p-3 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded-lg text-left hover:shadow-md transition-all justify-start"
                variant="outline"
              >
                <FileText className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-midnight-700 dark:text-midnight-300">Generate Invoice</span>
              </Button>
              
              <Button 
                className="w-full p-3 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded-lg text-left hover:shadow-md transition-all justify-start"
                variant="outline"
              >
                <Settings className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-midnight-700 dark:text-midnight-300">Save as Template</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
