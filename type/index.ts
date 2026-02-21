import { RelativePathString } from "expo-router"

export const DATABASE_NAME = "memo"

export interface ThemeColorPalette {
    background: string
    border: string
    text: string
    gray: string
    icon: string
    routing: string
}

export enum MemoType {
    FILE = "file",
    FOLDER = "folder"
}

export interface Memo {
    id: number
    type: MemoType
    title: string
    content?: string
    parentId: number | null
    path: RelativePathString
    createdAt: number
    updatedAt: number
    viewedAt?: number
}

export type FormValues = {
    title: string
    content: string
}

export enum SortType {
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    TITLE = "title"
}

export interface Modal {
    visible: boolean
    message: string
    onConfirm: () => Promise<void> | void
    confirmText: string
}

export enum AppBar {
    MAIN = "main",
    FILE = "file",
    FOLDER_ACTION = "folderAction",
    PASTE = "paste"
}

export enum SelectedMemoType {
    COPY = "copy",
    CUT = "cut"
}

export interface SelectedMemo {
    memo: Memo[]
    type: SelectedMemoType
}

export interface SearchInput {
    value: string
    visible: boolean
}
