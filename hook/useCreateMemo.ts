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

    const { mutate: createFile } = useMutation({
        mutationFn: async ({ title, content, parentId }: CreateFileProps) => {
            const now = Math.floor(Date.now() / 1000)

            await db.runAsync(
                `INSERT INTO ${MemoType.FILE} (type, title, content, parentId, createdAt, updatedAt, viewedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [MemoType.FILE, title, content, parentId, now, now, now]
            )
            await invalidateParentAndGrandparent(parentId)
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
            const now = Math.floor(Date.now() / 1000)

            await db.runAsync(
                `INSERT INTO ${MemoType.FOLDER} (type, title, parentId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?)`,
                [MemoType.FOLDER, "새 폴더", parentId, now, now]
            )

            await invalidateParentAndGrandparent(parentId)
        }
    })

    return { createFile, createFolder }
}
