import { pgTable, serial, varchar, text, integer, jsonb } from "drizzle-orm/pg-core";
import { builders } from "./builders.js";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  builderId: integer("builder_id").references(() => builders.id).notNull(),
  name: varchar("name", { length: 100 }),
  description: text("description"),
  techStack: jsonb("tech_stack"),
  role: varchar("role", { length: 50 }),
});
