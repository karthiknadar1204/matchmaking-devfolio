import { pgTable, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { builders } from "./builders.js";

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  builderId: integer("builder_id").references(() => builders.id).notNull(),
  hackathonTypes: jsonb("hackathon_types"),
  preferredRoles: jsonb("preferred_roles"),
});
