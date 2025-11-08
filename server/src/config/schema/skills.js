import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { builders } from "./builders.js";

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const builderSkills = pgTable("builder_skills", {
  builderId: integer("builder_id").references(() => builders.id).notNull(),
  skillId: integer("skill_id").references(() => skills.id).notNull(),
});
