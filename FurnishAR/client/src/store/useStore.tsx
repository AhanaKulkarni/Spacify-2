import { create } from "zustand";
import { Project, FurnitureModel, Note } from "@shared/schema";

interface FurnitureItem {
  id: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  color: string;
  texture: string;
}

interface RoomPoint {
  x: number;
  y: number;
}

interface UserStats {
  activeProjects: number;
  totalProjects: number;
  modelsUploaded: number;
  maxUploads: number;
  subscription: string;
  clientViews: number;
  monthlyProjects: number;
}

interface AppState {
  // Current view state
  currentView: "2d" | "3d" | "ar";
  vastuMode: boolean;
  selectedProject: Project | null;
  selectedFurniture: FurnitureItem | null;
  
  // Data
  projects: Project[];
  furnitureModels: FurnitureModel[];
  userStats: UserStats | null;
  
  // UI state
  showNewProjectModal: boolean;
  showSubscriptionModal: boolean;
  showARModal: boolean;
  
  // Room editing
  roomShape: RoomPoint[];
  isEditingRoom: boolean;
  
  // Actions
  setCurrentView: (view: "2d" | "3d" | "ar") => void;
  toggleVastuMode: () => void;
  setSelectedProject: (project: Project | null) => void;
  setSelectedFurniture: (furniture: FurnitureItem | null) => void;
  setProjects: (projects: Project[]) => void;
  setFurnitureModels: (models: FurnitureModel[]) => void;
  setUserStats: (stats: UserStats) => void;
  setShowNewProjectModal: (show: boolean) => void;
  setShowSubscriptionModal: (show: boolean) => void;
  setShowARModal: (show: boolean) => void;
  setRoomShape: (shape: RoomPoint[]) => void;
  setIsEditingRoom: (editing: boolean) => void;
  updateProjectFurniture: (projectId: number, furniture: FurnitureItem[]) => void;
  addFurnitureToProject: (projectId: number, furnitureItem: FurnitureItem) => void;
  removeFurnitureFromProject: (projectId: number, furnitureId: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  currentView: "2d",
  vastuMode: false,
  selectedProject: null,
  selectedFurniture: null,
  projects: [],
  furnitureModels: [],
  userStats: null,
  showNewProjectModal: false,
  showSubscriptionModal: false,
  showARModal: false,
  roomShape: [
    { x: 50, y: 50 },
    { x: 350, y: 50 },
    { x: 350, y: 200 },
    { x: 200, y: 200 },
    { x: 200, y: 250 },
    { x: 50, y: 250 }
  ],
  isEditingRoom: false,

  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  
  toggleVastuMode: () => set((state) => ({ vastuMode: !state.vastuMode })),
  
  setSelectedProject: (project) => {
    set({ selectedProject: project });
    if (project?.roomShape) {
      set({ roomShape: project.roomShape as RoomPoint[] });
    }
  },
  
  setSelectedFurniture: (furniture) => set({ selectedFurniture: furniture }),
  
  setProjects: (projects) => set({ projects }),
  
  setFurnitureModels: (models) => set({ furnitureModels: models }),
  
  setUserStats: (stats) => set({ userStats: stats }),
  
  setShowNewProjectModal: (show) => set({ showNewProjectModal: show }),
  
  setShowSubscriptionModal: (show) => set({ showSubscriptionModal: show }),
  
  setShowARModal: (show) => set({ showARModal: show }),
  
  setRoomShape: (shape) => set({ roomShape: shape }),
  
  setIsEditingRoom: (editing) => set({ isEditingRoom: editing }),
  
  updateProjectFurniture: (projectId, furniture) => {
    const projects = get().projects.map(project => 
      project.id === projectId 
        ? { ...project, furniture }
        : project
    );
    set({ projects });
    
    // Update selected project if it's the one being modified
    const selectedProject = get().selectedProject;
    if (selectedProject?.id === projectId) {
      set({ selectedProject: { ...selectedProject, furniture } });
    }
  },
  
  addFurnitureToProject: (projectId, furnitureItem) => {
    const projects = get().projects.map(project => {
      if (project.id === projectId) {
        const furniture = Array.isArray(project.furniture) ? project.furniture : [];
        return { ...project, furniture: [...furniture, furnitureItem] };
      }
      return project;
    });
    set({ projects });
    
    // Update selected project if it's the one being modified
    const selectedProject = get().selectedProject;
    if (selectedProject?.id === projectId) {
      const furniture = Array.isArray(selectedProject.furniture) ? selectedProject.furniture : [];
      set({ selectedProject: { ...selectedProject, furniture: [...furniture, furnitureItem] } });
    }
  },
  
  removeFurnitureFromProject: (projectId, furnitureId) => {
    const projects = get().projects.map(project => {
      if (project.id === projectId) {
        const furniture = Array.isArray(project.furniture) ? project.furniture : [];
        return { 
          ...project, 
          furniture: furniture.filter((item: any) => item.id !== furnitureId) 
        };
      }
      return project;
    });
    set({ projects });
    
    // Update selected project if it's the one being modified
    const selectedProject = get().selectedProject;
    if (selectedProject?.id === projectId) {
      const furniture = Array.isArray(selectedProject.furniture) ? selectedProject.furniture : [];
      set({ 
        selectedProject: { 
          ...selectedProject, 
          furniture: furniture.filter((item: any) => item.id !== furnitureId) 
        } 
      });
    }
  }
}));
