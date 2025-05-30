import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  MoreVertical,
  Folder,
  Upload,
  TrendingUp,
  Users,
  Package
} from 'lucide-react';
import { Project } from '@shared/schema';

interface ProjectStats {
  activeProjects: number;
  modelsUploaded: string;
  clientViews: number;
  monthlyProjects: string;
}

export function Dashboard() {
  const { 
    currentUser, 
    projects, 
    setShowNewProjectModal,
    setCurrentProject 
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('All Room Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Mock project data for demo
  const mockProjects: Project[] = [
    {
      id: 1,
      userId: 1,
      name: 'Modern Living Room',
      clientName: 'Johnson Family',
      roomType: 'Living Room',
      dimensions: { length: 20, width: 15, height: 10 },
      roomShape: [],
      furnitureItems: [],
      householdInfo: { children: true, pets: false, seniors: false },
      status: 'active',
      vastuEnabled: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-17'),
    },
    {
      id: 2,
      userId: 1,
      name: 'Master Bedroom',
      clientName: 'Smith Residence',
      roomType: 'Bedroom',
      dimensions: { length: 16, width: 12, height: 10 },
      roomShape: [],
      furnitureItems: [],
      householdInfo: { children: false, pets: false, seniors: true },
      status: 'active',
      vastuEnabled: false,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: 3,
      userId: 1,
      name: 'Contemporary Kitchen',
      clientName: 'Wilson Home',
      roomType: 'Kitchen',
      dimensions: { length: 14, width: 10, height: 9 },
      roomShape: [],
      furnitureItems: [],
      householdInfo: { children: true, pets: true, seniors: false },
      status: 'active',
      vastuEnabled: false,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  const stats: ProjectStats = {
    activeProjects: mockProjects.filter(p => p.status === 'active').length,
    modelsUploaded: `${currentUser?.uploadsUsed || 247}/400`,
    clientViews: 1234,
    monthlyProjects: '8 Projects',
  };

  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
  };

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

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="glassmorphism border shadow-xl">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-midnight-800 dark:text-white mb-2">
                Welcome back, <span className="text-blue-600">{currentUser?.firstName}</span>
              </h1>
              <p className="text-midnight-600 dark:text-midnight-300">
                Manage your interior design projects and collaborate with clients
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowNewProjectModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
              <Button variant="outline" className="bg-white dark:bg-midnight-700">
                Browse Templates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glassmorphism border shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-midnight-600 dark:text-midnight-400 text-sm font-medium">
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-midnight-800 dark:text-white">
                  {stats.activeProjects}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-midnight-600 dark:text-midnight-400 text-sm font-medium">
                  Models Uploaded
                </p>
                <p className="text-2xl font-bold text-midnight-800 dark:text-white">
                  {stats.modelsUploaded}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-midnight-600 dark:text-midnight-400 text-sm font-medium">
                  Client Views
                </p>
                <p className="text-2xl font-bold text-midnight-800 dark:text-white">
                  {stats.clientViews.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-midnight-600 dark:text-midnight-400 text-sm font-medium">
                  This Month
                </p>
                <p className="text-2xl font-bold text-midnight-800 dark:text-white">
                  {stats.monthlyProjects}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="glassmorphism border shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search projects, clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-midnight-400" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select 
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-midnight-700 dark:text-midnight-300"
              >
                <option>All Room Types</option>
                <option>Bedroom</option>
                <option>Living Room</option>
                <option>Kitchen</option>
                <option>Pooja Room</option>
              </select>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-midnight-700 dark:text-midnight-300"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Card 
            key={project.id}
            className="glassmorphism border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group"
            onClick={() => handleProjectClick(project)}
          >
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-midnight-700 dark:to-midnight-600 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className={`${getStatusColor(project.status)} text-white px-2 py-1 text-xs font-medium`}>
                  {project.status}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="bg-white dark:bg-midnight-700 p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4 text-midnight-600 dark:text-midnight-300" />
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
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
                  <span>{project.dimensions.length}×{project.dimensions.width} ft</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-1">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
