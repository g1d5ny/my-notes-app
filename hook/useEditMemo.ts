import { MemoType } from "@/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import Toast from "react-native-toast-message"

export const useEditMemo = () => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()

    // parentId와 그 부모(parentId의 parentId)만 invalidate하는 함수
    const invalidateParentAndGrandparent = async (parentId: number | null) => {
        // parentId 자체 invalidate
        await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })

        // parentId가 null이 아니면 그 부모도 찾아서 invalidate
        if (parentId !== null) {
            const folder = await db.getFirstAsync<{ parentId: number | null }>(`SELECT parentId FROM ${MemoType.FOLDER} WHERE id = ?`, [parentId])
            if (folder?.parentId !== null) {
                await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, folder?.parentId] })
            }
        }
    }

    const { mutate: saveTitle } = useMutation({
        mutationFn: async ({ title, memoId, parentId }: { title: string; memoId: number; parentId: number | null }) => {
            const now = Math.floor(Date.now() / 1000)
            await db.runAsync(`UPDATE ${MemoType.FILE} SET title = ?, updatedAt = ? WHERE id = ?`, [title, now, memoId])
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })
            // 파일 상세 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
        }
    })

    const { mutate: saveContent } = useMutation({
        mutationFn: async ({ content, memoId, parentId }: { content: string; memoId: number; parentId: number | null }) => {
            const now = Math.floor(Date.now() / 1000)
            await db.runAsync(`UPDATE ${MemoType.FILE} SET content = ?, updatedAt = ? WHERE id = ?`, [content, now, memoId])
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })
            // 파일 상세 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
        }
    })

    const { mutate: deleteMemo } = useMutation({
        mutationFn: async ({ memoId, parentId }: { memoId: number; parentId: number | null }) => {
            await db.runAsync(`DELETE FROM ${MemoType.FILE} WHERE id = ?`, [memoId])
            // parentId와 그 부모 폴더 목록 invalidate
            await invalidateParentAndGrandparent(parentId)
        },
        onSuccess: () => {
            Toast.show({
                text1: "글이 삭제되었습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
            router.back()
        },
        onError: () => {
            Toast.show({
                text1: "글 삭제에 실패했습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        }
    })

    return { saveTitle, saveContent, deleteMemo }
}
