import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  subscription: text("subscription").notNull().default("basic"), // basic, pro, enterprise
  uploadsUsed: integer("uploads_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  clientName: text("client_name").notNull(),
  roomType: text("room_type").notNull(),
  dimensions: jsonb("dimensions").notNull(), // {length, width, height}
  roomShape: jsonb("room_shape").notNull(), // Array of polygon points
  furnitureItems: jsonb("furniture_items").notNull().default("[]"), // Array of placed furniture
  householdInfo: jsonb("household_info").notNull(), // {children, pets, seniors}
  status: text("status").notNull().default("active"), // active, completed, archived
  vastuEnabled: boolean("vastu_enabled").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const furnitureModels = pgTable("furniture_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // beds, sofas, chairs, tables, wall_decor, dining, cutlery
  modelUrl: text("model_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  isDefault: boolean("is_default").notNull().default(true),
  uploadedBy: integer("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectNotes = pgTable("project_notes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("general"), // general, bed_area, wall_decor, furniture
  isPrivate: boolean("is_private").notNull().default(false),
  position: jsonb("position"), // {x, y} for positioning notes on canvas
  createdAt: timestamp("created_at").defaultNow(),
});

export const moodboardImages = pgTable("moodboard_images", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clientShares = pgTable("client_shares", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  shareToken: text("share_token").notNull().unique(),
  canEdit: boolean("can_edit").notNull().default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  uploadsUsed: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFurnitureModelSchema = createInsertSchema(furnitureModels).omit({
  id: true,
  createdAt: true,
});

export const insertProjectNoteSchema = createInsertSchema(projectNotes).omit({
  id: true,
  createdAt: true,
});

export const insertMoodboardImageSchema = createInsertSchema(moodboardImages).omit({
  id: true,
  createdAt: true,
});

export const insertClientShareSchema = createInsertSchema(clientShares).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type FurnitureModel = typeof furnitureModels.$inferSelect;
export type InsertFurnitureModel = z.infer<typeof insertFurnitureModelSchema>;

export type ProjectNote = typeof projectNotes.$inferSelect;
export type InsertProjectNote = z.infer<typeof insertProjectNoteSchema>;

export type MoodboardImage = typeof moodboardImages.$inferSelect;
export type InsertMoodboardImage = z.infer<typeof insertMoodboardImageSchema>;

export type ClientShare = typeof clientShares.$inferSelect;
export type InsertClientShare = z.infer<typeof insertClientShareSchema>;

// Additional types for furniture placement
export interface PlacedFurniture {
  id: string;
  modelId: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  color: string;
  texture: string;
}

export interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

export interface RoomPoint {
  x: number;
  y: number;
}

export interface HouseholdInfo {
  children: boolean;
  pets: boolean;
  seniors: boolean;
}
