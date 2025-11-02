import { foreignKey, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const folder = sqliteTable(
    "folder",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        type: text("type").notNull(),
        title: text("title").notNull(),
        parentId: integer("parentId")
    },
    table => ({
        parentIdFk: foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: "folder_parentId_fk"
        }).onDelete("cascade")
    })
)

export const file = sqliteTable(
    "file",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        type: text("type").notNull(),
        title: text("title").notNull(),
        content: text("content").notNull(),
        parentId: integer("parentId"),
        createdAt: integer("createdAt").notNull(),
        updatedAt: integer("updatedAt").notNull(),
        viewedAt: integer("viewedAt").notNull()
    },
    table => ({
        parentIdFk: foreignKey({
            columns: [table.parentId],
            foreignColumns: [folder.id],
            name: "file_parentId_fk"
        }).onDelete("cascade")
    })
)

export type Folder = typeof folder.$inferSelect
export type File = typeof file.$inferSelect
