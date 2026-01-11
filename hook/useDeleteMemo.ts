import { MemoType } from "@/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import Toast from "react-native-toast-message"

interface DeleteProps {
    id: number
    parentId: number | null
}

export const useDeleteMemo = () => {
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

    const { mutate: resetMemo } = useMutation({
        mutationFn: async () => {
            // TODO: db 아예 초기화하는 방법으로 교체
            await db.runAsync(`DELETE FROM ${MemoType.FOLDER}`)
            await db.runAsync(`DELETE FROM ${MemoType.FILE}`)
            await db.execAsync(`DROP TABLE IF EXISTS ${MemoType.FOLDER}`)
            await db.execAsync(`DROP TABLE IF EXISTS ${MemoType.FILE}`)
            await db.execAsync(`PRAGMA user_version = 0`)
        }
    })

    const { mutate: deleteFolder } = useMutation({
        mutationFn: async ({ id, parentId }: DeleteProps) => {
            await db.runAsync(`DELETE FROM ${MemoType.FOLDER} WHERE id = ?`, [id])
            await invalidateParentAndGrandparent(parentId)
        },
        onSuccess: () => {
            Toast.show({
                text1: "폴더가 삭제되었습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        },
        onError: () => {
            Toast.show({
                text1: "폴더 삭제에 실패했습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        }
    })

    const { mutate: deleteFile } = useMutation({
        mutationFn: async ({ id, parentId }: DeleteProps) => {
            await db.runAsync(`DELETE FROM ${MemoType.FILE} WHERE id = ?`, [id])
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
            if (router.canGoBack()) {
                router.back()
            }
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

    return { resetMemo, deleteFile, deleteFolder }
}
