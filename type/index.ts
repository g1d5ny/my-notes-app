import { RelativePathString } from "expo-router"

export const DATABASE_NAME = "memo"

export interface ThemeColorPalette {
    background: string
    border: string
    text: string
    // gray: {
    //     1: string
    //     2: string
    // }
    gray: string
    icon: string
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
    createdAt?: number
    updatedAt?: number
    viewedAt?: number
}

export type FormValues = {
    title: string
    content: string
}
