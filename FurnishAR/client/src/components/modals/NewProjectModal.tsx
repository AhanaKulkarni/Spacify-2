import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Home, Users, Heart, UserCheck } from 'lucide-react';
import { Project, RoomDimensions, HouseholdInfo } from '@shared/schema';

interface NewProjectFormData {
  clientName: string;
  projectName: string;
  roomType: string;
  dimensions: RoomDimensions;
  householdInfo: HouseholdInfo;
  addDefaultFurniture: boolean;
}

export function NewProjectModal() {
  const { 
    showNewProjectModal, 
    setShowNewProjectModal, 
    addProject, 
    setCurrentProject,
    currentUser 
  } = useAppStore();

  const [formData, setFormData] = useState<NewProjectFormData>({
    clientName: '',
    projectName: '',
    roomType: '',
    dimensions: { length: 20, width: 15, height: 10 },
    householdInfo: { children: false, pets: false, seniors: false },
    addDefaultFurniture: true,
  });

  const [step, setStep] = useState<'basic' | 'room' | 'household' | 'options'>('basic');

  if (!showNewProjectModal) return null;

  const roomTypes = [
    'Bedroom',
    'Living Room', 
    'Kitchen',
    'Dining Room',
    'Pooja Room',
    'Office',
    'Bathroom',
    'Study',
    'Guest Room'
  ];

  const handleClose = () => {
    setShowNewProjectModal(false);
    setStep('basic');
    setFormData({
      clientName: '',
      projectName: '',
      roomType: '',
      dimensions: { length: 20, width: 15, height: 10 },
      householdInfo: { children: false, pets: false, seniors: false },
      addDefaultFurniture: true,
    });
  };

  const handleNext = () => {
    switch (step) {
      case 'basic':
        if (formData.clientName && formData.projectName) {
          setStep('room');
        }
        break;
      case 'room':
        if (formData.roomType && formData.dimensions.length && formData.dimensions.width) {
          setStep('household');
        }
        break;
      case 'household':
        setStep('options');
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'room':
        setStep('basic');
        break;
      case 'household':
        setStep('room');
        break;
      case 'options':
        setStep('household');
        break;
    }
  };

  const handleSubmit = () => {
    if (!currentUser) return;

    const newProject: Project = {
      id: Date.now(),
      userId: currentUser.id,
      name: formData.projectName,
      clientName: formData.clientName,
      roomType: formData.roomType,
      dimensions: formData.dimensions,
      roomShape: [
        { x: 50, y: 50 },
        { x: 350, y: 50 },
        { x: 350, y: 250 },
        { x: 50, y: 250 },
      ],
      furnitureItems: [],
      householdInfo: formData.householdInfo,
      status: 'active',
      vastuEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addProject(newProject);
    setCurrentProject(newProject);
    handleClose();
  };

  const canProceed = () => {
    switch (step) {
      case 'basic':
        return formData.clientName.trim() && formData.projectName.trim();
      case 'room':
        return formData.roomType && formData.dimensions.length > 0 && formData.dimensions.width > 0;
      case 'household':
        return true; // Always can proceed from household
      case 'options':
        return true; // Always can proceed from options
      default:
        return false;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {(['basic', 'room', 'household', 'options'] as const).map((stepName, index) => (
        <div key={stepName} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
            step === stepName 
              ? 'bg-blue-500 text-white' 
              : index < (['basic', 'room', 'household', 'options'] as const).indexOf(step)
                ? 'bg-green-500 text-white'
                : 'bg-midnight-200 dark:bg-midnight-600 text-midnight-600 dark:text-midnight-400'
          }`}>
            {index + 1}
          </div>
          {index < 3 && (
            <div className={`w-8 h-0.5 ${
              index < (['basic', 'room', 'household', 'options'] as const).indexOf(step)
                ? 'bg-green-500'
                : 'bg-midnight-200 dark:bg-midnight-600'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <Card className="bg-white dark:bg-midnight-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-midnight-200 dark:border-midnight-600">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-midnight-800 dark:text-white">
              Create New Project
            </h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-6 h-6 text-midnight-400" />
            </Button>
          </div>
          {renderStepIndicator()}
        </div>
        
        <CardContent className="p-6 space-y-6">
          {/* Basic Information */}
          {step === 'basic' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                      Client Name *
                    </label>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Enter client name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                      Project Name *
                    </label>
                    <Input
                      value={formData.projectName}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                      placeholder="Enter project name"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Room Details */}
          {step === 'room' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
                  Room Details
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                    Room Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {roomTypes.map((type) => (
                      <Button
                        key={type}
                        size="sm"
                        variant={formData.roomType === type ? 'default' : 'outline'}
                        onClick={() => setFormData(prev => ({ ...prev, roomType: type }))}
                        className="text-sm"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-midnight-700 dark:text-midnight-300 mb-2">
                    Dimensions (feet) *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-midnight-600 dark:text-midnight-400 mb-1">
                        Length
                      </label>
                      <Input
                        type="number"
                        value={formData.dimensions.length}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { ...prev.dimensions, length: Number(e.target.value) }
                        }))}
                        placeholder="20"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-midnight-600 dark:text-midnight-400 mb-1">
                        Width
                      </label>
                      <Input
                        type="number"
                        value={formData.dimensions.width}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { ...prev.dimensions, width: Number(e.target.value) }
                        }))}
                        placeholder="15"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-midnight-600 dark:text-midnight-400 mb-1">
                        Height
                      </label>
                      <Input
                        type="number"
                        value={formData.dimensions.height}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          dimensions: { ...prev.dimensions, height: Number(e.target.value) }
                        }))}
                        placeholder="10"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Household Information */}
          {step === 'household' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
                  Household Information
                </h3>
                <p className="text-sm text-midnight-600 dark:text-midnight-400 mb-6">
                  This helps us provide better furniture recommendations and safety considerations.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                          Children in home?
                        </span>
                        <p className="text-xs text-midnight-600 dark:text-midnight-400">
                          Affects safety and furniture choices
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.householdInfo.children}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        householdInfo: { ...prev.householdInfo, children: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-green-600" />
                      <div>
                        <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                          Pets in home?
                        </span>
                        <p className="text-xs text-midnight-600 dark:text-midnight-400">
                          Influences material and fabric choices
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.householdInfo.pets}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        householdInfo: { ...prev.householdInfo, pets: checked }
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-purple-600" />
                      <div>
                        <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                          Senior citizens?
                        </span>
                        <p className="text-xs text-midnight-600 dark:text-midnight-400">
                          Ensures accessibility considerations
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.householdInfo.seniors}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        householdInfo: { ...prev.householdInfo, seniors: checked }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Final Options */}
          {step === 'options' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-midnight-800 dark:text-white mb-4">
                  Initial Setup
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
                    <div>
                      <span className="text-midnight-700 dark:text-midnight-300 font-medium">
                        Add default furniture
                      </span>
                      <p className="text-sm text-midnight-600 dark:text-midnight-400">
                        Pre-populate room with basic furniture based on room type
                      </p>
                    </div>
                    <Switch
                      checked={formData.addDefaultFurniture}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        addDefaultFurniture: checked
                      }))}
                    />
                  </div>

                  {/* Project Summary */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
                      Project Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-400">Client:</span>
                        <span className="text-blue-800 dark:text-blue-300 font-medium">
                          {formData.clientName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-400">Project:</span>
                        <span className="text-blue-800 dark:text-blue-300 font-medium">
                          {formData.projectName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-400">Room:</span>
                        <span className="text-blue-800 dark:text-blue-300 font-medium">
                          {formData.roomType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-400">Size:</span>
                        <span className="text-blue-800 dark:text-blue-300 font-medium">
                          {formData.dimensions.length}×{formData.dimensions.width}×{formData.dimensions.height} ft
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-400">Household:</span>
                        <div className="flex space-x-1">
                          {formData.householdInfo.children && (
                            <Badge variant="secondary" className="text-xs">Children</Badge>
                          )}
                          {formData.householdInfo.pets && (
                            <Badge variant="secondary" className="text-xs">Pets</Badge>
                          )}
                          {formData.householdInfo.seniors && (
                            <Badge variant="secondary" className="text-xs">Seniors</Badge>
                          )}
                          {!formData.householdInfo.children && !formData.householdInfo.pets && !formData.householdInfo.seniors && (
                            <span className="text-blue-800 dark:text-blue-300 text-xs">None specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Modal Footer */}
        <div className="p-6 border-t border-midnight-200 dark:border-midnight-600 flex justify-between">
          <Button
            variant="outline"
            onClick={step === 'basic' ? handleClose : handleBack}
          >
            {step === 'basic' ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            onClick={step === 'options' ? handleSubmit : handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
          >
            {step === 'options' ? 'Create Project' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
