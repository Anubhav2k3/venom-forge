import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === CLIENT SIDE TYPES ===
// Since this is a client-side tool, these schemas are primarily for frontend form validation
// and local storage structure.

export const payloadTypes = [
  "bash", "nc", "python", "perl", "php", "ruby", "golang", "java", "powershell", "lua", "nodejs", "awk", "socat", "dart", "groovy"
] as const;

export const obfuscationTypes = ["none", "base64", "url", "double_base64", "hex"] as const;

export const payloadConfigSchema = z.object({
  ip: z.string().min(1, "IP Address is required").default("10.10.10.10"),
  port: z.coerce.number().min(1).max(65535).default(9001),
  type: z.enum(payloadTypes).default("bash"),
  shell: z.string().default("/bin/bash"),
  obfuscation: z.enum(obfuscationTypes).default("none"),
});

export type PayloadConfig = z.infer<typeof payloadConfigSchema>;

export const savedPayloadSchema = payloadConfigSchema.extend({
  id: z.string(),
  name: z.string().optional(),
  createdAt: z.number(),
  isFavorite: z.boolean().default(false),
  generatedPayload: z.string(),
  listenerCommand: z.string(),
});

export type SavedPayload = z.infer<typeof savedPayloadSchema>;

// === DB SCHEMAS (Placeholder for template compliance) ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
