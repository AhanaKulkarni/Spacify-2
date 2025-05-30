import { Eye, MoreHorizontal, Heart } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface Project {
  id: string;
  name: string;
  clientName: string;
  roomType: string;
  dimensions: { length: number; width: number; height: number };
  status: 'active' | 'completed' | 'archived';
  updatedAt: number;
}

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const getRoomImage = (roomType: string) => {
    const images = {
      'Bedroom': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      'Living Room': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      'Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      'Dining Room': 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      'Office': 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    };
    return images[roomType as keyof typeof images] || images['Living Room'];
  };

  return (
    <div 
      className="glassmorphism rounded-xl overflow-hidden border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group animate-fade-in"
      onClick={() => onOpen(project)}
    >
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-midnight-700 dark:to-midnight-600 relative overflow-hidden">
        <img 
          src={getRoomImage(project.roomType)} 
          alt={`${project.name} project preview`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-4 left-4">
          <span className={`${getStatusColor(project.status)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
            {getStatusText(project.status)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button 
            className="bg-white dark:bg-midnight-700 p-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // Handle favorite action
            }}
          >
            <Heart className="w-4 h-4 text-midnight-600 dark:text-midnight-300" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-midnight-800 dark:text-white text-lg">
              {project.name}
            </h3>
            <p className="text-midnight-600 dark:text-midnight-400 text-sm">
              {project.clientName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-midnight-500 dark:text-midnight-400">
              {getTimeAgo(project.updatedAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-midnight-600 dark:text-midnight-400">
            <span>{project.roomType}</span>
            <span>
              {project.dimensions.length}×{project.dimensions.width} ft
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="text-blue-600 hover:text-blue-700 p-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(project);
              }}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              className="text-midnight-400 hover:text-midnight-600 p-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle more options
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
