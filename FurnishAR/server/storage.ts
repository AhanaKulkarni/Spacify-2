import { 
  users, 
  projects, 
  furnitureModels, 
  projectNotes, 
  moodboardImages, 
  clientShares,
  type User, 
  type InsertUser,
  type Project, 
  type InsertProject,
  type FurnitureModel, 
  type InsertFurnitureModel,
  type ProjectNote, 
  type InsertProjectNote,
  type MoodboardImage, 
  type InsertMoodboardImage,
  type ClientShare, 
  type InsertClientShare
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Furniture model operations
  getFurnitureModel(id: number): Promise<FurnitureModel | undefined>;
  getFurnitureModels(): Promise<FurnitureModel[]>;
  getFurnitureModelsByCategory(category: string): Promise<FurnitureModel[]>;
  createFurnitureModel(model: InsertFurnitureModel): Promise<FurnitureModel>;
  updateFurnitureModel(id: number, updates: Partial<FurnitureModel>): Promise<FurnitureModel | undefined>;
  deleteFurnitureModel(id: number): Promise<boolean>;
  
  // Project notes operations
  getProjectNotes(projectId: number): Promise<ProjectNote[]>;
  createProjectNote(note: InsertProjectNote): Promise<ProjectNote>;
  updateProjectNote(id: number, updates: Partial<ProjectNote>): Promise<ProjectNote | undefined>;
  deleteProjectNote(id: number): Promise<boolean>;
  
  // Moodboard operations
  getMoodboardImages(projectId: number): Promise<MoodboardImage[]>;
  createMoodboardImage(image: InsertMoodboardImage): Promise<MoodboardImage>;
  updateMoodboardImage(id: number, updates: Partial<MoodboardImage>): Promise<MoodboardImage | undefined>;
  deleteMoodboardImage(id: number): Promise<boolean>;
  
  // Client sharing operations
  getClientShare(shareToken: string): Promise<ClientShare | undefined>;
  getClientSharesByProjectId(projectId: number): Promise<ClientShare[]>;
  createClientShare(share: InsertClientShare): Promise<ClientShare>;
  updateClientShare(id: number, updates: Partial<ClientShare>): Promise<ClientShare | undefined>;
  deleteClientShare(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private furnitureModels: Map<number, FurnitureModel>;
  private projectNotes: Map<number, ProjectNote>;
  private moodboardImages: Map<number, MoodboardImage>;
  private clientShares: Map<number, ClientShare>;
  
  private userIdCounter: number;
  private projectIdCounter: number;
  private furnitureModelIdCounter: number;
  private projectNoteIdCounter: number;
  private moodboardImageIdCounter: number;
  private clientShareIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.furnitureModels = new Map();
    this.projectNotes = new Map();
    this.moodboardImages = new Map();
    this.clientShares = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.furnitureModelIdCounter = 1;
    this.projectNoteIdCounter = 1;
    this.moodboardImageIdCounter = 1;
    this.clientShareIdCounter = 1;

    // Initialize with demo user
    this.createUser({
      username: "sarah_anderson",
      password: "demo123",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Anderson",
      subscription: "pro"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      uploadsUsed: 0,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { 
      ...project, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Furniture model operations
  async getFurnitureModel(id: number): Promise<FurnitureModel | undefined> {
    return this.furnitureModels.get(id);
  }

  async getFurnitureModels(): Promise<FurnitureModel[]> {
    return Array.from(this.furnitureModels.values());
  }

  async getFurnitureModelsByCategory(category: string): Promise<FurnitureModel[]> {
    return Array.from(this.furnitureModels.values()).filter(
      (model) => model.category === category,
    );
  }

  async createFurnitureModel(insertModel: InsertFurnitureModel): Promise<FurnitureModel> {
    const id = this.furnitureModelIdCounter++;
    const model: FurnitureModel = { 
      ...insertModel, 
      id,
      createdAt: new Date()
    };
    this.furnitureModels.set(id, model);
    return model;
  }

  async updateFurnitureModel(id: number, updates: Partial<FurnitureModel>): Promise<FurnitureModel | undefined> {
    const model = this.furnitureModels.get(id);
    if (!model) return undefined;
    
    const updatedModel = { ...model, ...updates };
    this.furnitureModels.set(id, updatedModel);
    return updatedModel;
  }

  async deleteFurnitureModel(id: number): Promise<boolean> {
    return this.furnitureModels.delete(id);
  }

  // Project notes operations
  async getProjectNotes(projectId: number): Promise<ProjectNote[]> {
    return Array.from(this.projectNotes.values()).filter(
      (note) => note.projectId === projectId,
    );
  }

  async createProjectNote(insertNote: InsertProjectNote): Promise<ProjectNote> {
    const id = this.projectNoteIdCounter++;
    const note: ProjectNote = { 
      ...insertNote, 
      id,
      createdAt: new Date()
    };
    this.projectNotes.set(id, note);
    return note;
  }

  async updateProjectNote(id: number, updates: Partial<ProjectNote>): Promise<ProjectNote | undefined> {
    const note = this.projectNotes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { ...note, ...updates };
    this.projectNotes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteProjectNote(id: number): Promise<boolean> {
    return this.projectNotes.delete(id);
  }

  // Moodboard operations
  async getMoodboardImages(projectId: number): Promise<MoodboardImage[]> {
    return Array.from(this.moodboardImages.values()).filter(
      (image) => image.projectId === projectId,
    );
  }

  async createMoodboardImage(insertImage: InsertMoodboardImage): Promise<MoodboardImage> {
    const id = this.moodboardImageIdCounter++;
    const image: MoodboardImage = { 
      ...insertImage, 
      id,
      createdAt: new Date()
    };
    this.moodboardImages.set(id, image);
    return image;
  }

  async updateMoodboardImage(id: number, updates: Partial<MoodboardImage>): Promise<MoodboardImage | undefined> {
    const image = this.moodboardImages.get(id);
    if (!image) return undefined;
    
    const updatedImage = { ...image, ...updates };
    this.moodboardImages.set(id, updatedImage);
    return updatedImage;
  }

  async deleteMoodboardImage(id: number): Promise<boolean> {
    return this.moodboardImages.delete(id);
  }

  // Client sharing operations
  async getClientShare(shareToken: string): Promise<ClientShare | undefined> {
    return Array.from(this.clientShares.values()).find(
      (share) => share.shareToken === shareToken,
    );
  }

  async getClientSharesByProjectId(projectId: number): Promise<ClientShare[]> {
    return Array.from(this.clientShares.values()).filter(
      (share) => share.projectId === projectId,
    );
  }

  async createClientShare(insertShare: InsertClientShare): Promise<ClientShare> {
    const id = this.clientShareIdCounter++;
    const share: ClientShare = { 
      ...insertShare, 
      id,
      createdAt: new Date()
    };
    this.clientShares.set(id, share);
    return share;
  }

  async updateClientShare(id: number, updates: Partial<ClientShare>): Promise<ClientShare | undefined> {
    const share = this.clientShares.get(id);
    if (!share) return undefined;
    
    const updatedShare = { ...share, ...updates };
    this.clientShares.set(id, updatedShare);
    return updatedShare;
  }

  async deleteClientShare(id: number): Promise<boolean> {
    return this.clientShares.delete(id);
  }
}

export const storage = new MemStorage();
