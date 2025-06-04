import { useTheme } from './ThemeProvider';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sun, 
  Moon, 
  Home, 
  FolderOpen, 
  Palette, 
  HelpCircle,
  Save,
  Download
} from 'lucide-react';
import { saveProjectToLocal, exportProjectAsJSON } from '@/lib/projectUtils';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, currentProject } = useAppStore();

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'basic':
        return 'bg-blue-500';
      case 'pro':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-500 to-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSave = () => {
    if (currentProject) {
      // Adapt currentProject to expected shape for saveProjectToLocal
      const projectData = {
        roomShape: currentProject.roomShape,
        placedFurniture: currentProject.furnitureItems || []
      };
      saveProjectToLocal(projectData);
    } else {
      alert('No project to save.');
    }
  };

  const handleExport = () => {
    if (currentProject) {
      // Adapt currentProject to expected shape for exportProjectAsJSON
      const projectData = {
        roomShape: currentProject.roomShape,
        placedFurniture: currentProject.furnitureItems || []
      };
      exportProjectAsJSON(projectData);
    } else {
      alert('No project to export.');
    }
  };

  return (
<header className="glassmorphism border-b border-midnight-200 dark:border-midnight-700 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img
          src="Spacify.png" // or "/Spacify.jpg" depending on your file
          alt="Spacify Logo"
          className="w-10 h-10 rounded-lg object-cover"
        />
        <span className="text-xl font-semibold text-midnight-800 dark:text-white">
          SPACIFY
        </span>
      </div>


          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Button variant="ghost" className="text-midnight-700 dark:text-midnight-300 hover:text-blue-600 dark:hover:text-blue-400">
              <Home className="w-4 h-4 mr-2" />
              Projects
            </Button>
            <Button variant="ghost" className="text-midnight-700 dark:text-midnight-300 hover:text-blue-600 dark:hover:text-blue-400">
              <FolderOpen className="w-4 h-4 mr-2" />
              Library
            </Button>
            <Button variant="ghost" className="text-midnight-700 dark:text-midnight-300 hover:text-blue-600 dark:hover:text-blue-400">
              <Palette className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button variant="ghost" className="text-midnight-700 dark:text-midnight-300 hover:text-blue-600 dark:hover:text-blue-400">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            {/* Save and Export Buttons */}
            <Button variant="ghost" className="text-midnight-700 dark:text-midnight-300 hover:text-green-600 dark:hover:text-green-400" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" className="text-midnight-700 dark:text-midnight-300 hover:text-purple-600 dark:hover:text-purple-400" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="p-2 bg-white dark:bg-midnight-700 shadow-sm border border-midnight-200 dark:border-midnight-600 hover:shadow-md"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-midnight-600 dark:text-midnight-300" />
              ) : (
                <Moon className="w-5 h-5 text-midnight-600 dark:text-midnight-300" />
              )}
            </Button>

            {/* Subscription Badge */}
            {currentUser && (
              <Badge 
                className={`hidden sm:flex items-center space-x-2 ${getSubscriptionColor(currentUser.subscription)} text-white px-3 py-1 text-sm font-medium`}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="capitalize">{currentUser.subscription} Plan</span>
              </Badge>
            )}

            {/* User Menu */}
            <div className="relative">
              <Button variant="ghost" className="flex items-center space-x-2 p-2 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : 'SA'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
