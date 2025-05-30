import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store/useStore";
import { NewProjectForm } from "@/components/NewProjectForm";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { Project } from "@shared/schema";
import {
  Plus,
  Search,
  Eye,
  MoreVertical,
  TrendingUp,
  Upload,
  Users,
  Calendar,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const {
    setProjects,
    setUserStats,
    setShowNewProjectModal,
    showNewProjectModal,
    showSubscriptionModal,
    projects,
    userStats,
  } = useStore();

  // Fetch projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch user stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData, setProjects]);

  useEffect(() => {
    if (statsData) {
      setUserStats(statsData);
    }
  }, [statsData, setUserStats]);

  const getStatusBadge = (status: string) => {
    const statusMap: {
      [key: string]: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      };
    } = {
      active: { label: "Active", variant: "default" },
      in_review: { label: "In Review", variant: "secondary" },
      pending: { label: "Pending", variant: "outline" },
      completed: { label: "Completed", variant: "secondary" },
    };

    const config = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProjectImage = (roomType: string) => {
    const imageMap: { [key: string]: string } = {
      "Living Room":
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      Bedroom:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      Kitchen:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      "Dining Room":
        "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop",
    };
    return (
      imageMap[roomType] ||
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="glassmorphism rounded-2xl p-6 md:p-8 border shadow-xl animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-midnight-800 dark:text-white mb-2">
                Welcome back, <span className="text-blue-600">Ahana</span>
              </h1>
              <p className="text-midnight-600 dark:text-midnight-300">
                Manage your interior design projects and collaborate with
                clients
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowNewProjectModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
              <Button
                variant="outline"
                className="bg-white dark:bg-midnight-700 text-midnight-700 dark:text-midnight-300 px-6 py-3 rounded-xl font-medium border border-midnight-200 dark:border-midnight-600 hover:shadow-md transition-all"
              >
                Browse Templates
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statsLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="glassmorphism border shadow-lg">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))
          ) : (
            <>
              <Card className="glassmorphism border shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-midnight-600 dark:text-midnight-400 text-sm font-medium">
                        Active Projects
                      </p>
                      <p className="text-2xl font-bold text-midnight-800 dark:text-white">
                        {userStats?.activeProjects || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                        {userStats?.modelsUploaded || 0}/
                        {userStats?.maxUploads || 400}
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
                        {userStats?.clientViews || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                        {userStats?.monthlyProjects || 0} Projects
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
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
                    className="pl-10 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-midnight-400" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Select>
                  <SelectTrigger className="w-40 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Room Types</SelectItem>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="living-room">Living Room</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="pooja">Pooja Room</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32 bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="glassmorphism border shadow-lg">
                    <Skeleton className="h-48 w-full rounded-t-xl" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            : projects.map((project: Project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <Card className="glassmorphism rounded-xl overflow-hidden border shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group project-card">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-midnight-700 dark:to-midnight-600 relative overflow-hidden">
                      <img
                        src={getProjectImage(project.roomType)}
                        alt={`${project.name} preview`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white dark:bg-midnight-700 p-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
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
                            {formatDistanceToNow(new Date(project.updatedAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-midnight-600 dark:text-midnight-400">
                          <span>{project.roomType}</span>
                          <span>
                            {project.dimensions?.length}×
                            {project.dimensions?.width} ft
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-700 p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </div>

      {/* Modals */}
      {showNewProjectModal && <NewProjectForm />}
      {showSubscriptionModal && <SubscriptionModal />}
    </main>
  );
}
