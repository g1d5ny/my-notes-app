import { MemoType } from "@/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"
import Toast from "react-native-toast-message"

interface CreateFolderProps {
    parentId: number | null
}

interface CreateFileProps extends CreateFolderProps {
    title: string
    content: string
}

interface DuplicateFolderProps {
    folderId: number
    newParentId: number | null
}
export const useCreateMemo = () => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()

    // parentId와 그 부모(parentId의 parentId)만 invalidate하는 함수
    const invalidateParentAndGrandparent = async (parentId: number | null) => {
        // parentId 자체 invalidate
        await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId ?? 0] })

        // parentId가 null이 아니면 그 부모도 찾아서 invalidate
        if (parentId !== null) {
            const folder = await db.getFirstAsync<{ parentId: number | null }>(`SELECT parentId FROM ${MemoType.FOLDER} WHERE id = ?`, [parentId])
            if (folder?.parentId !== null) {
                await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, folder?.parentId] })
            }
        }
    }

    const createFileFn = async ({ title, content, parentId }: CreateFileProps) => {
        const now = Math.floor(Date.now() / 1000)

        await db.runAsync(
            `INSERT INTO ${MemoType.FILE} (type, title, content, parentId, createdAt, updatedAt, viewedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [MemoType.FILE, title, content, parentId, now, now, now]
        )
        await invalidateParentAndGrandparent(parentId)
    }

    const { mutate: createFile } = useMutation({
        mutationFn: async ({ title, content, parentId }: CreateFileProps) => {
            createFileFn({ title, content, parentId })
        },
        onSuccess: () => {
            Toast.show({
                text1: "작성된 글이 저장되었습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        },
        onError: e => {
            console.error(e)
            Toast.show({
                text1: "메모 작성에 실패했습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        }
    })

    const { mutate: createFolder } = useMutation({
        mutationFn: async ({ parentId }: CreateFolderProps) => {
            const now = Math.floor(Date.now() / 1000)

            await db.runAsync(
                `INSERT INTO ${MemoType.FOLDER} (type, title, parentId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?)`,
                [MemoType.FOLDER, "새 폴더", parentId, now, now]
            )

            await invalidateParentAndGrandparent(parentId)
        }
    })

    // 폴더와 그 하위 항목들을 재귀적으로 복제하는 함수
    const duplicateFolderRecursive = async (sourceFolderId: number, newParentId: number | null): Promise<number> => {
        const now = Math.floor(Date.now() / 1000)

        // 원본 폴더 정보 가져오기
        const sourceFolder = await db.getFirstAsync<{
            id: number
            title: string
            parentId: number | null
            createdAt: number
            updatedAt: number
        }>(`SELECT * FROM ${MemoType.FOLDER} WHERE id = ?`, [sourceFolderId])

        if (!sourceFolder) {
            throw new Error("복제할 폴더를 찾을 수 없습니다.")
        }

        // 새 폴더 생성 (복제본)
        const result = await db.runAsync(
            `INSERT INTO ${MemoType.FOLDER} (type, title, parentId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?)`,
            [MemoType.FOLDER, `${sourceFolder.title}`, newParentId, now, now]
        )

        const newFolderId = result.lastInsertRowId

        // 원본 폴더의 모든 하위 폴더를 재귀적으로 복제
        const childFolders = await db.getAllAsync<{
            id: number
            title: string
            parentId: number | null
            createdAt: number
            updatedAt: number
        }>(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId = ?`, [sourceFolderId])

        for (const childFolder of childFolders) {
            await duplicateFolderRecursive(childFolder.id, newFolderId)
        }

        // 원본 폴더의 모든 파일 복제
        const childFiles = await db.getAllAsync<{
            id: number
            title: string
            content: string
            parentId: number | null
            createdAt: number
            updatedAt: number
            viewedAt: number
        }>(`SELECT * FROM ${MemoType.FILE} WHERE parentId = ?`, [sourceFolderId])

        for (const childFile of childFiles) {
            await db.runAsync(
                `INSERT INTO ${MemoType.FILE} (type, title, content, parentId, createdAt, updatedAt, viewedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [MemoType.FILE, childFile.title, childFile.content, newFolderId, now, now, now]
            )
        }

        return newFolderId
    }

    const { mutate: duplicateFolder } = useMutation({
        mutationFn: async ({ folderId, newParentId }: DuplicateFolderProps) => {
            await duplicateFolderRecursive(folderId, newParentId)
            await invalidateParentAndGrandparent(newParentId)
        },
        onSuccess: () => {
            Toast.show({
                text1: "폴더가 복제되었습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        },
        onError: e => {
            console.error(e)
            Toast.show({
                text1: "폴더 복제에 실패했습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        }
    })

    return { createFile, createFolder, duplicateFolder, createFileFn }
}
