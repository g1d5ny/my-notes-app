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
export const useCreateMemo = () => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()

    const { mutate: createFile } = useMutation({
        mutationFn: async ({ title, content, parentId }: CreateFileProps) => {
            const now = Math.floor(Date.now() / 1000)
            await db.runAsync(
                `INSERT INTO ${MemoType.FILE} (type, title, content, parentId, createdAt, updatedAt, viewedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [MemoType.FILE, title, content, parentId, now, now, now]
            )
            // 부모 폴더 목록 invalidate
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })
        },
        onSuccess: () => {
            Toast.show({
                text1: "작성된 글이 저장되었습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        },
        onError: () => {
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
            await db.runAsync(
                `INSERT INTO ${MemoType.FOLDER} (type, title, parentId)
                VALUES (?, ?, ?)`,
                [MemoType.FOLDER, "새 폴더", parentId]
            )

            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })
        }
    })

    return { createFile, createFolder }
}
