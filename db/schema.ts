import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const folder = sqliteTable("folder", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    parentId: text("parentId"),
    createdAt: integer("createdAt").notNull(),
    updatedAt: integer("updatedAt").notNull()
})

export const file = sqliteTable("file", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    parentId: text("parentId"),
    createdAt: integer("createdAt").notNull(),
    updatedAt: integer("updatedAt").notNull()
})

export type Folder = typeof folder.$inferSelect
export type File = typeof file.$inferSelect
