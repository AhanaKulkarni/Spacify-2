import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProjectSchema, 
  insertFurnitureModelSchema,
  insertProjectNoteSchema,
  insertMoodboardImageSchema,
  insertClientShareSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(userId, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (userId) {
        const projects = await storage.getProjectsByUserId(userId);
        res.json(projects);
      } else {
        res.status(400).json({ message: "userId parameter required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = req.body;
      const project = await storage.updateProject(projectId, updates);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const deleted = await storage.deleteProject(projectId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Furniture model routes
  app.get("/api/furniture-models", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      if (category) {
        const models = await storage.getFurnitureModelsByCategory(category);
        res.json(models);
      } else {
        const models = await storage.getFurnitureModels();
        res.json(models);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/furniture-models/:id", async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      const model = await storage.getFurnitureModel(modelId);
      
      if (!model) {
        return res.status(404).json({ message: "Furniture model not found" });
      }
      
      res.json(model);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/furniture-models", async (req, res) => {
    try {
      const modelData = insertFurnitureModelSchema.parse(req.body);
      const model = await storage.createFurnitureModel(modelData);
      res.status(201).json(model);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid furniture model data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Project notes routes
  app.get("/api/projects/:projectId/notes", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const notes = await storage.getProjectNotes(projectId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/notes", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const noteData = insertProjectNoteSchema.parse({
        ...req.body,
        projectId
      });
      const note = await storage.createProjectNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const deleted = await storage.deleteProjectNote(noteId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Moodboard routes
  app.get("/api/projects/:projectId/moodboard", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const images = await storage.getMoodboardImages(projectId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/moodboard", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const imageData = insertMoodboardImageSchema.parse({
        ...req.body,
        projectId
      });
      const image = await storage.createMoodboardImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid image data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/moodboard/:id", async (req, res) => {
    try {
      const imageId = parseInt(req.params.id);
      const deleted = await storage.deleteMoodboardImage(imageId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Client sharing routes
  app.get("/api/projects/:projectId/shares", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const shares = await storage.getClientSharesByProjectId(projectId);
      res.json(shares);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/shares", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const shareData = insertClientShareSchema.parse({
        ...req.body,
        projectId,
        shareToken: `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
      const share = await storage.createClientShare(shareData);
      res.status(201).json(share);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid share data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/shares/:token", async (req, res) => {
    try {
      const shareToken = req.params.token;
      const share = await storage.getClientShare(shareToken);
      
      if (!share) {
        return res.status(404).json({ message: "Share not found" });
      }
      
      // Check if share is expired
      if (share.expiresAt && new Date() > share.expiresAt) {
        return res.status(410).json({ message: "Share link has expired" });
      }
      
      // Get the associated project
      const project = await storage.getProject(share.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ share, project });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // File upload simulation route
  app.post("/api/upload/furniture", async (req, res) => {
    try {
      // Simulate file upload processing
      const { name, category, uploadedBy } = req.body;
      
      if (!name || !category) {
        return res.status(400).json({ message: "Name and category required" });
      }

      // Check user upload limits
      if (uploadedBy) {
        const user = await storage.getUser(uploadedBy);
        if (user) {
          const limits = {
            basic: 150,
            pro: 400,
            enterprise: Infinity
          };
          
          const limit = limits[user.subscription as keyof typeof limits] || 150;
          
          if (user.uploadsUsed >= limit) {
            return res.status(429).json({ 
              message: "Upload limit exceeded",
              limit,
              used: user.uploadsUsed
            });
          }

          // Increment upload count
          await storage.updateUser(uploadedBy, { 
            uploadsUsed: user.uploadsUsed + 1 
          });
        }
      }

      // Create furniture model record
      const model = await storage.createFurnitureModel({
        name,
        category,
        modelUrl: `/uploads/furniture/${Date.now()}.gltf`,
        thumbnailUrl: `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300`,
        isDefault: false,
        uploadedBy: uploadedBy || null
      });

      res.status(201).json(model);
    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
