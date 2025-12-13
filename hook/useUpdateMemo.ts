import { MemoType } from "@/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"

export const useUpdateMemo = () => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()

    const { mutate: updateFileTitle } = useMutation({
        mutationFn: async ({ title, memoId, parentId }: { title: string; memoId: number; parentId: number | null }) => {
            const now = Math.floor(Date.now() / 1000)
            await db.runAsync(`UPDATE ${MemoType.FILE} SET title = ?, updatedAt = ? WHERE id = ?`, [title, now, memoId])
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId ?? 0] })
            // 파일 상세 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
        }
    })

    const { mutate: updateFolderTitle } = useMutation({
        mutationFn: async ({ title, memoId, parentId }: { title: string; memoId: number; parentId: number | null }) => {
            const now = Math.floor(Date.now() / 1000)
            await db.runAsync(`UPDATE ${MemoType.FOLDER} SET title = ?, updatedAt = ? WHERE id = ?`, [title, now, memoId])
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId ?? 0] })
            // 파일 상세 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
        }
    })

    const { mutate: updateFileContent } = useMutation({
        mutationFn: async ({ content, memoId, parentId }: { content: string; memoId: number; parentId: number | null }) => {
            const now = Math.floor(Date.now() / 1000)
            await db.runAsync(`UPDATE ${MemoType.FILE} SET content = ?, updatedAt = ? WHERE id = ?`, [content, now, memoId])
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId ?? 0] })
            // 파일 상세 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
        }
    })

    return { updateFileTitle, updateFolderTitle, updateFileContent }
}
