import { relations } from "drizzle-orm"
import { integer, sqliteTable, text, type AnySQLiteColumn } from "drizzle-orm/sqlite-core"

export const folder = sqliteTable("folder", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    parentId: integer("parentId").references((): AnySQLiteColumn => folder.id, { onDelete: "cascade", onUpdate: "no action" }),
    createdAt: integer("createdAt").notNull(),
    updatedAt: integer("updatedAt").notNull()
})

export const file = sqliteTable("file", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    parentId: integer("parentId").references((): AnySQLiteColumn => folder.id, { onDelete: "cascade", onUpdate: "no action" }),
    createdAt: integer("createdAt").notNull(),
    updatedAt: integer("updatedAt").notNull(),
    viewedAt: integer("viewedAt").notNull()
})

export const folderRelations = relations(folder, ({ one, many }) => ({
    parent: one(folder, {
        fields: [folder.parentId],
        references: [folder.id]
    }),
    children: many(folder),
    files: many(file)
}))

export const fileRelations = relations(file, ({ one }) => ({
    parent: one(folder, {
        fields: [file.parentId],
        references: [folder.id]
    })
}))
