import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share, Save, Eye } from 'lucide-react';
import { Room2DEditor } from './Room2DEditor';
import { Room3DViewer } from './Room3DViewer';
import { FurniturePanel } from './FurniturePanel';
import { CustomizationPanel } from './CustomizationPanel';
import { VastuPanel } from './VastuPanel';
import { MoodboardPanel } from './MoodboardPanel';
import { NotesPanel } from './NotesPanel';
import { ARViewer } from './ARViewer';

export function ProjectEditor() {
  const { 
    currentProject, 
    setCurrentProject, 
    currentView, 
    setCurrentView,
    vastuMode,
    setVastuMode,
    showARModal,
    setShowARModal 
  } = useAppStore();

  if (!currentProject) {
    return null;
  }

  const handleBackToDashboard = () => {
    setCurrentProject(null);
  };

  const handleShare = () => {
    // Simulate sharing functionality
    const shareUrl = `${window.location.origin}/share/${currentProject.id}`;
    navigator.clipboard.writeText(shareUrl);
    // You would typically show a toast notification here
    console.log('Share URL copied to clipboard:', shareUrl);
  };

  const handleSave = () => {
    // Simulate save functionality
    console.log('Project saved:', currentProject);
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <Card className="glassmorphism border shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="text-midnight-600 dark:text-midnight-300 hover:text-blue-600 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-midnight-800 dark:text-white">
                  {currentProject.name}
                </h2>
                <p className="text-midnight-600 dark:text-midnight-400 text-sm">
                  {currentProject.clientName} • {currentProject.dimensions.length}×{currentProject.dimensions.width} ft
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-white dark:bg-midnight-700 rounded-lg p-1 border border-midnight-200 dark:border-midnight-600">
                <Button
                  variant={currentView === '2d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('2d')}
                  className="view-toggle-btn"
                >
                  2D
                </Button>
                <Button
                  variant={currentView === '3d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('3d')}
                  className="view-toggle-btn"
                >
                  3D
                </Button>
                <Button
                  variant={currentView === 'ar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setShowARModal(true)}
                  className="view-toggle-btn"
                >
                  AR
                </Button>
              </div>
              
              {/* Vastu Toggle */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded-lg">
                <span className="text-sm font-medium text-midnight-700 dark:text-midnight-300">
                  Vastu
                </span>
                <Switch
                  checked={vastuMode}
                  onCheckedChange={setVastuMode}
                />
              </div>

              {/* Action Buttons */}
              <Button 
                onClick={handleShare}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Furniture Panel */}
        <div className="lg:col-span-1 space-y-6">
          <FurniturePanel />
          <CustomizationPanel />
        </div>

        {/* Main Canvas Area */}
        <div className="lg:col-span-2">
          {currentView === '2d' && <Room2DEditor />}
          {currentView === '3d' && <Room3DViewer />}
        </div>

        {/* Right Sidebar - Tools and Info */}
        <div className="lg:col-span-1 space-y-6">
          {vastuMode && <VastuPanel />}
          <MoodboardPanel />
          <NotesPanel />
          
          {/* Quick Actions */}
          <Card className="glassmorphism border shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleShare}
                >
                  <Share className="w-5 h-5 mr-3 text-blue-600" />
                  Share with Client
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Save className="w-5 h-5 mr-3 text-green-600" />
                  Generate Invoice
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-5 h-5 mr-3 text-purple-600" />
                  Save as Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AR Modal */}
      {showARModal && <ARViewer />}
    </div>
  );
}
