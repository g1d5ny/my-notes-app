import { MemoType } from "@/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import Toast from "react-native-toast-message"

export const useEditMemo = () => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()

    const { mutate: saveTitle } = useMutation({
        mutationFn: async ({ title, memoId, parentId }: { title: string; memoId: number; parentId: number | null }) => {
            await db.runAsync(`UPDATE ${MemoType.FILE} SET title = ? WHERE id = ?`, [title, memoId])
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })
            // 파일 상세 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
        }
    })

    const { mutate: saveContent } = useMutation({
        mutationFn: async ({ content, memoId, parentId }: { content: string; memoId: number; parentId: number | null }) => {
            await db.runAsync(`UPDATE ${MemoType.FILE} SET content = ? WHERE id = ?`, [content, memoId])
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })
            // 파일 상세 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
        }
    })

    const { mutate: deleteMemo } = useMutation({
        mutationFn: async ({ memoId, parentId }: { memoId: number; parentId: number | null }) => {
            await db.runAsync(`DELETE FROM ${MemoType.FILE} WHERE id = ?`, [memoId])
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })
            // 파일 상세 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
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
