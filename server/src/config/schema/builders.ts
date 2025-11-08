import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const builders = pgTable("builders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  headline: text("headline"),
  location: varchar("location", { length: 100 }),
  experienceYears: integer("experience_years").default(0),
  availability: varchar("availability", { length: 30 }),
  github: varchar("github", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});
