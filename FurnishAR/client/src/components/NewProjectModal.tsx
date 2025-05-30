import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const roomTypes = [
  'Bedroom',
  'Living Room', 
  'Kitchen',
  'Dining Room',
  'Pooja Room',
  'Office',
  'Bathroom'
];

export function NewProjectModal() {
  const { 
    showNewProjectModal, 
    setShowNewProjectModal, 
    addProject,
    setCurrentProject 
  } = useAppStore();

  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    roomType: '',
    length: '',
    width: '',
    height: '',
    hasChildren: false,
    hasPets: false,
    hasSeniors: false,
    defaultFurniture: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.projectName || !formData.roomType || 
        !formData.length || !formData.width || !formData.height) {
      return;
    }

    const newProject = {
      name: formData.projectName,
      clientName: formData.clientName,
      roomType: formData.roomType,
      dimensions: {
        length: parseInt(formData.length),
        width: parseInt(formData.width),
        height: parseInt(formData.height),
      },
      roomShape: [
        { x: 50, y: 50 },
        { x: 350, y: 50 },
        { x: 350, y: 250 },
        { x: 50, y: 250 },
      ],
      furniture: [],
      moodboard: [],
      notes: [],
      settings: {
        hasChildren: formData.hasChildren,
        hasPets: formData.hasPets,
        hasSeniors: formData.hasSeniors,
        defaultFurniture: formData.defaultFurniture,
      },
      status: 'active' as const,
      vastuEnabled: false,
    };

    addProject(newProject);
    setShowNewProjectModal(false);
    
    // Reset form
    setFormData({
      clientName: '',
      projectName: '',
      roomType: '',
      length: '',
      width: '',
      height: '',
      hasChildren: false,
      hasPets: false,
      hasSeniors: false,
      defaultFurniture: true,
    });
  };

  const handleClose = () => {
    setShowNewProjectModal(false);
  };

  if (!showNewProjectModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-midnight-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6 border-b border-midnight-200 dark:border-midnight-600">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-midnight-800 dark:text-white">
              Create New Project
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-midnight-400 hover:text-midnight-600 dark:text-midnight-500 dark:hover:text-midnight-300"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName" className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="input-field"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectName" className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="input-field"
                  placeholder="Enter project name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div>
            <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
              Room Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <Label htmlFor="roomType" className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                  Room Type
                </Label>
                <select
                  id="roomType"
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select room type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length" className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                  Length (ft)
                </Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="input-field"
                  placeholder="20"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="width" className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                  Width (ft)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  className="input-field"
                  placeholder="15"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="height" className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                  Height (ft)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="input-field"
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Household Information */}
          <div>
            <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
              Household Information
            </h3>
            <div className="space-y-3">
              {[
                { key: 'hasChildren', label: 'Children in home?' },
                { key: 'hasPets', label: 'Pets in home?' },
                { key: 'hasSeniors', label: 'Senior citizens?' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
                  <span className="text-midnight-700 dark:text-midnight-300">{label}</span>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={formData[key as keyof typeof formData] ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, [key]: true })}
                      className="px-4 py-2 text-sm"
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={!formData[key as keyof typeof formData] ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, [key]: false })}
                      className="px-4 py-2 text-sm"
                    >
                      No
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Default Furniture */}
          <div>
            <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
              Initial Setup
            </h3>
            <div className="flex items-center justify-between p-4 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
              <div>
                <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                  Add default furniture
                </span>
                <p className="text-sm text-midnight-600 dark:text-midnight-400">
                  Pre-populate room with basic furniture based on room type
                </p>
              </div>
              <Button
                type="button"
                variant={formData.defaultFurniture ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormData({ ...formData, defaultFurniture: !formData.defaultFurniture })}
                className="w-12 h-6 p-0 rounded-full"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.defaultFurniture ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </Button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-midnight-200 dark:border-midnight-600">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
