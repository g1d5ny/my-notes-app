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

    // 드래그로 다른 폴더 안으로 이동 (parentId 변경)
    const { mutateAsync: moveMemo } = useMutation({
        mutationFn: async ({ memoId, type, fromParentId, toParentId }: { memoId: number; type: MemoType; fromParentId: number | null; toParentId: number | null }) => {
            // 폴더는 자기 자신이나 자기 하위로 이동 금지 (순환 방지)
            if (type === MemoType.FOLDER) {
                let ancestor: number | null = toParentId
                while (ancestor != null) {
                    if (ancestor === memoId) throw new Error("cannot move a folder into itself or its descendant")
                    const row = await db.getFirstAsync<{ parentId: number | null }>(`SELECT parentId FROM ${MemoType.FOLDER} WHERE id = ?`, [ancestor])
                    ancestor = row?.parentId ?? null
                }
            }

            const now = Math.floor(Date.now() / 1000)
            await db.runAsync(`UPDATE ${type} SET parentId = ?, updatedAt = ? WHERE id = ?`, [toParentId, now, memoId])

            // 출발 폴더 + 도착 폴더 목록 둘 다 갱신
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, fromParentId ?? 0] })
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, toParentId ?? 0] })
        }
    })

    return { updateFileTitle, updateFolderTitle, updateFileContent, moveMemo }
}
