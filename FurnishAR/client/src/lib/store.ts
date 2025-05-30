import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, PlacedFurniture, RoomPoint, User, FurnitureModel } from '@shared/schema';

interface AppState {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Theme state
  isDark: boolean;
  toggleTheme: () => void;

  // Current project state
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;

addNote?: (note: string) => void;
deleteNote?: (noteId: string) => void;
addMoodboardImage?: (imageUrl: string) => void;
removeMoodboardImage?: (imageUrl: string) => void;
// other state properties...

  // Projects list
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;

  // View state
  currentView: '2d' | '3d' | 'ar';
  setCurrentView: (view: '2d' | '3d' | 'ar') => void;

  // Vastu mode
  vastuMode: boolean;
  setVastuMode: (enabled: boolean) => void;

  // Furniture state
  selectedFurniture: PlacedFurniture | null;
  setSelectedFurniture: (furniture: PlacedFurniture | null) => void;

  // Room editing
  isEditingRoom: boolean;
  setIsEditingRoom: (editing: boolean) => void;

  // Room shape (polygon points)
  roomShape: RoomPoint[];
  setRoomShape: (points: RoomPoint[]) => void;

  // Placed furniture
  placedFurniture: PlacedFurniture[];
  setPlacedFurniture: (furniture: PlacedFurniture[]) => void;
  addFurniture: (furniture: PlacedFurniture) => void;
  updateFurniture: (id: string, updates: Partial<PlacedFurniture>) => void;
  removeFurniture: (id: string) => void;

  // Furniture library
  furnitureLibrary: FurnitureModel[];
  setFurnitureLibrary: (models: FurnitureModel[]) => void;

  // Transform mode
  transformMode: 'move' | 'rotate' | 'scale' | null;
  setTransformMode: (mode: 'move' | 'rotate' | 'scale' | null) => void;

  // Modal states
  showNewProjectModal: boolean;
  setShowNewProjectModal: (show: boolean) => void;
  
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;

  showARModal: boolean;
  setShowARModal: (show: boolean) => void;

  // Subscription state
  uploadLimit: number;
  uploadsUsed: number;
  setUploadsUsed: (count: number) => void;
  incrementUploads: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      currentUser: {
        id: 1,
        username: "sarah_anderson",
        password: "",
        email: "sarah@example.com",
        firstName: "Sarah",
        lastName: "Anderson",
        subscription: "pro",
        uploadsUsed: 247,
        createdAt: new Date(),
      },
      setCurrentUser: (user) => set({ currentUser: user }),

      // Theme state
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

      // Current project state
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),

      // Projects list
      projects: [],
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({ 
        projects: [...state.projects, project] 
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      // View state
      currentView: '2d',
      setCurrentView: (view) => set({ currentView: view }),

      // Vastu mode
      vastuMode: false,
      setVastuMode: (enabled) => set({ vastuMode: enabled }),

      // Furniture state
      selectedFurniture: null,
      setSelectedFurniture: (furniture) => set({ selectedFurniture: furniture }),

      // Room editing
      isEditingRoom: true,
      setIsEditingRoom: (editing) => set({ isEditingRoom: editing }),

      // Room shape
      roomShape: [
        { x: 50, y: 50 },
        { x: 350, y: 50 },
        { x: 350, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 250 },
        { x: 50, y: 250 },
      ],
      setRoomShape: (points) => set({ roomShape: points }),

      // Placed furniture
      placedFurniture: [],
      setPlacedFurniture: (furniture) => set({ placedFurniture: furniture }),
      addFurniture: (furniture) => set((state) => ({
        placedFurniture: [...state.placedFurniture, furniture]
      })),
      updateFurniture: (id, updates) => set((state) => ({
        placedFurniture: state.placedFurniture.map(f => 
          f.id === id ? { ...f, ...updates } : f
        )
      })),
      removeFurniture: (id) => set((state) => ({
        placedFurniture: state.placedFurniture.filter(f => f.id !== id)
      })),

      // Furniture library
      furnitureLibrary: [],
      setFurnitureLibrary: (models) => set({ furnitureLibrary: models }),

      // Transform mode
      transformMode: null,
      setTransformMode: (mode) => set({ transformMode: mode }),

      // Modal states
      showNewProjectModal: false,
      setShowNewProjectModal: (show) => set({ showNewProjectModal: show }),
      
      showSubscriptionModal: false,
      setShowSubscriptionModal: (show) => set({ showSubscriptionModal: show }),

      showARModal: false,
      setShowARModal: (show) => set({ showARModal: show }),

      // Subscription state
      uploadLimit: 400, // Pro plan limit
      uploadsUsed: 247,
      setUploadsUsed: (count) => set({ uploadsUsed: count }),
      incrementUploads: () => set((state) => {
        const newCount = state.uploadsUsed + 1;
        if (newCount >= state.uploadLimit) {
          return { uploadsUsed: newCount, showSubscriptionModal: true };
        }
        return { uploadsUsed: newCount };
      }),
    }),
    {
      name: 'furnish-ar-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isDark: state.isDark,
        projects: state.projects,
        uploadsUsed: state.uploadsUsed,
      }),
    }
  )
);
