import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { X, Home, Users, Baby, PawPrint } from "lucide-react";
import { InsertProject } from "@shared/schema";

type RoomTypeOption = {
  value: string;
  label: string;
  icon: string;
};

const roomTypes: RoomTypeOption[] = [
  { value: "bedroom", label: "Bedroom", icon: "🛏️" },
  { value: "living-room", label: "Living Room", icon: "🛋️" },
  { value: "kitchen", label: "Kitchen", icon: "🍳" },
  { value: "dining-room", label: "Dining Room", icon: "🍽️" },
  { value: "pooja", label: "Pooja Room", icon: "🕉️" },
  { value: "office", label: "Office", icon: "💼" },
  { value: "bathroom", label: "Bathroom", icon: "🚿" },
  { value: "guest-room", label: "Guest Room", icon: "🛌" },
];

export function NewProjectForm() {
  const { setShowNewProjectModal, setSelectedProject } = useStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    clientName: "",
    projectName: "",
    roomType: "",
    length: "",
    width: "",
    height: "10",
    children: false,
    pets: false,
    seniors: false,
    addDefaultFurniture: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: InsertProject) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create project");
      }
      return response.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setSelectedProject(project);
      setShowNewProjectModal(false);
      toast({ 
        title: "Project created successfully!", 
        description: `${project.name} is ready for design.`
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to create project", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }
    if (!formData.roomType) {
      newErrors.roomType = "Room type is required";
    }
    if (!formData.length || parseFloat(formData.length) <= 0) {
      newErrors.length = "Valid length is required";
    }
    if (!formData.width || parseFloat(formData.width) <= 0) {
      newErrors.width = "Valid width is required";
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = "Valid height is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({ 
        title: "Please fix the errors", 
        variant: "destructive" 
      });
      return;
    }

    // Generate default room shape based on dimensions
    const length = parseFloat(formData.length);
    const width = parseFloat(formData.width);
    const scale = 15; // Scale factor for canvas coordinates

    const roomShape = [
      { x: 50, y: 50 },
      { x: 50 + (length * scale), y: 50 },
      { x: 50 + (length * scale), y: 50 + (width * scale) },
      { x: 50, y: 50 + (width * scale) }
    ];

    const projectData: InsertProject = {
      userId: 1, // Mock user ID for MVP
      name: formData.projectName.trim(),
      clientName: formData.clientName.trim(),
      roomType: roomTypes.find(rt => rt.value === formData.roomType)?.label || formData.roomType,
      dimensions: {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height)
      },
      roomShape,
      furniture: formData.addDefaultFurniture ? [
        // Add a default furniture item based on room type
        {
          id: formData.roomType === "bedroom" ? 1 : formData.roomType === "living-room" ? 6 : 16,
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          color: "gray",
          texture: "wood"
        }
      ] : [],
      household: {
        children: formData.children,
        pets: formData.pets,
        seniors: formData.seniors
      },
      status: "active",
      vastuEnabled: false
    };

    createProjectMutation.mutate(projectData);
  };

  const handleClose = () => {
    setShowNewProjectModal(false);
  };

  const toggleOption = (field: "children" | "pets" | "seniors") => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-midnight-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-midnight-200 dark:border-midnight-600">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-midnight-800 dark:text-white">
              Create New Project
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="text-midnight-400 hover:text-midnight-600 dark:text-midnight-500 dark:hover:text-midnight-300"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <p className="text-midnight-600 dark:text-midnight-400 mt-2">
            Set up a new interior design project for your client
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2 block">
                  Client Name *
                </Label>
                <Input 
                  id="clientName"
                  type="text" 
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  className={`w-full ${errors.clientName ? 'border-red-500' : ''}`}
                  placeholder="Enter client name"
                />
                {errors.clientName && (
                  <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="projectName" className="text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2 block">
                  Project Name *
                </Label>
                <Input 
                  id="projectName"
                  type="text" 
                  value={formData.projectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  className={`w-full ${errors.projectName ? 'border-red-500' : ''}`}
                  placeholder="Enter project name"
                />
                {errors.projectName && (
                  <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div>
            <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-600" />
              Room Details
            </h3>
            
            <div className="mb-4">
              <Label htmlFor="roomType" className="text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2 block">
                Room Type *
              </Label>
                <Select
                value={formData.roomType}
                onValueChange={(value: string) =>
                  setFormData((prev: typeof formData) => ({ ...prev, roomType: value }))
                }
                >
                <SelectTrigger className={`w-full ${errors.roomType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type: RoomTypeOption) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center">
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                    </span>
                  </SelectItem>
                  ))}
                </SelectContent>
                </Select>
              {errors.roomType && (
                <p className="text-red-500 text-xs mt-1">{errors.roomType}</p>
              )}
            </div>
            
            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length" className="text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2 block">
                  Length (ft) *
                </Label>
                <Input 
                  id="length"
                  type="number" 
                  value={formData.length}
                  onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                  className={`w-full ${errors.length ? 'border-red-500' : ''}`}
                  placeholder="20"
                  min="1"
                  step="0.1"
                />
                {errors.length && (
                  <p className="text-red-500 text-xs mt-1">{errors.length}</p>
                )}
              </div>
              <div>
                <Label htmlFor="width" className="text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2 block">
                  Width (ft) *
                </Label>
                <Input 
                  id="width"
                  type="number" 
                  value={formData.width}
                  onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                  className={`w-full ${errors.width ? 'border-red-500' : ''}`}
                  placeholder="15"
                  min="1"
                  step="0.1"
                />
                {errors.width && (
                  <p className="text-red-500 text-xs mt-1">{errors.width}</p>
                )}
              </div>
              <div>
                <Label htmlFor="height" className="text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2 block">
                  Height (ft) *
                </Label>
                <Input 
                  id="height"
                  type="number" 
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className={`w-full ${errors.height ? 'border-red-500' : ''}`}
                  placeholder="10"
                  min="1"
                  step="0.1"
                />
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                )}
              </div>
            </div>
          </div>

          {/* Household Information */}
          <div>
            <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
              Household Information
            </h3>
            <div className="space-y-3">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.children ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                }`}
                onClick={() => toggleOption('children')}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Baby className="w-5 h-5 text-blue-600" />
                    <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                      Children in home?
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={formData.children ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={!formData.children ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      No
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.pets ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : ''
                }`}
                onClick={() => toggleOption('pets')}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <PawPrint className="w-5 h-5 text-green-600" />
                    <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                      Pets in home?
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={formData.pets ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={!formData.pets ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      No
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.seniors ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' : ''
                }`}
                onClick={() => toggleOption('seniors')}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                      Senior citizens?
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={formData.seniors ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={!formData.seniors ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      No
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Initial Setup */}
          <div>
            <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
              Initial Setup
            </h3>
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.addDefaultFurniture ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
              }`}
              onClick={() => setFormData(prev => ({ ...prev, addDefaultFurniture: !prev.addDefaultFurniture }))}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                    Add default furniture
                  </span>
                  <p className="text-sm text-midnight-600 dark:text-midnight-400 mt-1">
                    Pre-populate room with basic furniture based on room type
                  </p>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${
                  formData.addDefaultFurniture ? 'bg-blue-500' : 'bg-midnight-200 dark:bg-midnight-600'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    formData.addDefaultFurniture ? 'right-1' : 'left-1'
                  }`}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-midnight-200 dark:border-midnight-600 flex justify-end space-x-3">
          <Button 
            type="button"
            onClick={handleClose} 
            variant="outline"
            disabled={createProjectMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createProjectMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
          >
            {createProjectMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
