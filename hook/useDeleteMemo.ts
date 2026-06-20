import { invalidateAllMemoQueries, invalidateMemoQueries } from "@/function/invalidate"
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

    const { mutate: resetMemo } = useMutation({
        mutationFn: async (_props: { parentId: number | null }) => {
            await db.runAsync(`DELETE FROM ${MemoType.FOLDER}`)
            await db.runAsync(`DELETE FROM ${MemoType.FILE}`)
            await db.execAsync(`PRAGMA user_version = 0`)
            await invalidateAllMemoQueries(queryClient)
            router.dismissAll()
        }
    })

    const deleteFolderFn = async ({ id, parentId }: DeleteProps) => {
        await db.runAsync(`DELETE FROM ${MemoType.FOLDER} WHERE id = ?`, [id])
        await invalidateMemoQueries(queryClient, [parentId])
    }

    const { mutate: deleteFolder } = useMutation({
        mutationFn: async ({ id, parentId }: DeleteProps) => {
            await deleteFolderFn({ id, parentId })
        },
        onSuccess: () => {
            Toast.show({
                text1: "폴더를 삭제했습니다.",
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

    const deleteFileFn = async ({ id, parentId }: DeleteProps) => {
        await db.runAsync(`DELETE FROM ${MemoType.FILE} WHERE id = ?`, [id])
        await invalidateMemoQueries(queryClient, [parentId])
    }

    const { mutate: deleteFile } = useMutation({
        mutationFn: async ({ id, parentId }: DeleteProps) => {
            await deleteFileFn({ id, parentId })
        },
        onSuccess: () => {
            Toast.show({
                text1: "파일을 삭제했습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
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

    return { resetMemo, deleteFile, deleteFolder, deleteFileFn, deleteFolderFn }
}
