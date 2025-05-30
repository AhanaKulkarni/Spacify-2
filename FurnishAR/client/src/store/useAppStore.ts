import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  subscription: 'basic' | 'pro' | 'enterprise';
  uploadsUsed: number;
  maxUploads: number;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  roomType: string;
  dimensions: { length: number; width: number; height: number };
  roomShape: Array<{ x: number; y: number }>;
  furniture: Array<{
    id: string;
    modelId: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    color: string;
    texture: string;
  }>;
  moodboard: Array<{ id: string; url: string; title: string }>;
  notes: Array<{
    id: string;
    content: string;
    area: string;
    timestamp: number;
    isPrivate: boolean;
  }>;
  settings: {
    hasChildren: boolean;
    hasPets: boolean;
    hasSeniors: boolean;
    defaultFurniture: boolean;
  };
  status: 'active' | 'completed' | 'archived';
  vastuEnabled: boolean;
  createdAt: number;
  updatedAt: number;
}

interface FurnitureModel {
  id: string;
  name: string;
  category: string;
  modelUrl: string;
  thumbnailUrl: string;
  isDefault: boolean;
}

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User) => void;
  
  // Projects
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Furniture models
  furnitureModels: FurnitureModel[];
  setFurnitureModels: (models: FurnitureModel[]) => void;
  addFurnitureModel: (model: Omit<FurnitureModel, 'id'>) => void;
  
  // UI state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentView: '2d' | '3d' | 'ar';
  setCurrentView: (view: '2d' | '3d' | 'ar') => void;
  isVastuMode: boolean;
  toggleVastuMode: () => void;
  selectedFurniture: string | null;
  setSelectedFurniture: (id: string | null) => void;
  
  // Modals
  showNewProjectModal: boolean;
  setShowNewProjectModal: (show: boolean) => void;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  showARModal: boolean;
  setShowARModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: {
        id: 1,
        name: 'Sarah Anderson',
        email: 'sarah@example.com',
        subscription: 'pro',
        uploadsUsed: 247,
        maxUploads: 400,
      },
      setUser: (user) => set({ user }),
      
      // Projects
      projects: [],
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: Date.now() }
              : project
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...updates, updatedAt: Date.now() }
              : state.currentProject,
        }));
      },
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },
      
      // Furniture models
      furnitureModels: [],
      setFurnitureModels: (models) => set({ furnitureModels: models }),
      addFurnitureModel: (modelData) => {
        const newModel: FurnitureModel = {
          ...modelData,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({ furnitureModels: [...state.furnitureModels, newModel] }));
      },
      
      // UI state
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },
      currentView: '2d',
      setCurrentView: (view) => set({ currentView: view }),
      isVastuMode: false,
      toggleVastuMode: () => set((state) => ({ isVastuMode: !state.isVastuMode })),
      selectedFurniture: null,
      setSelectedFurniture: (id) => set({ selectedFurniture: id }),
      
      // Modals
      showNewProjectModal: false,
      setShowNewProjectModal: (show) => set({ showNewProjectModal: show }),
      showSubscriptionModal: false,
      setShowSubscriptionModal: (show) => set({ showSubscriptionModal: show }),
      showARModal: false,
      setShowARModal: (show) => set({ showARModal: show }),
    }),
    {
      name: 'furnish-ar-storage',
      partialize: (state) => ({
        user: state.user,
        projects: state.projects,
        furnitureModels: state.furnitureModels,
        theme: state.theme,
      }),
    }
  )
);
