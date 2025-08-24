// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `job-assist_${name}`);

export const resume = createTable("resume", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  title: d.text().notNull(),
  filePath: d.text(),
  content: d.text(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

// export const resume = createTable(
//   "resume",
//   (d) => ({
//     id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
//     company: d.varchar({ length: 256 }),
//     filePath: d.text(),
//     createdAt: d
//       .timestamp({ withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
//   }),
//   (t) => [index("name_idx").on(t.company)],
// );
//
//
export type InsertResume = typeof resume.$inferInsert;
export type SelectResume = typeof resume.$inferSelect;
export type NullishResume = SelectResume | undefined;

export const job = createTable("job", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  title: d.text().notNull(),
  description: d.text().notNull(),
  url: d.text(),
  resumeId: d.integer().references(() => resume.id),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export type InsertJob = typeof job.$inferInsert;
export type SelectJob = typeof job.$inferSelect;
export type NullishJob = SelectResume | undefined;
