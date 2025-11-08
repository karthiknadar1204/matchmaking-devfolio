import { pgTable, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { builders } from "./builders";

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  builderId: integer("builder_id").references(() => builders.id).notNull(),
  hackathonTypes: jsonb("hackathon_types").$type<string[]>(),
  preferredRoles: jsonb("preferred_roles").$type<string[]>(),
});
