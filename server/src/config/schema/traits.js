import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { builders } from "./builders.js";

export const traits = pgTable("traits", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const builderTraits = pgTable("builder_traits", {
  builderId: integer("builder_id").references(() => builders.id).notNull(),
  traitId: integer("trait_id").references(() => traits.id).notNull(),
});
